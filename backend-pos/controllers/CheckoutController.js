const midtransClient = require('midtrans-client');
const { generateRandomInvoice } = require('../utils/generateRandomInvoice');
const prisma = require('../prisma/client');

const createSnapTransaction = async (req, res) => {
    try {
        const { amount, customerName, customerEmail, customerPhone, cartItems } = req.body;

        let snap = new midtransClient.Snap({
            isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        });

        const invoiceId = generateRandomInvoice();

        const transactionDb = await prisma.transaction.create({
            data: {
                customer_id: req.userId,
                invoice: invoiceId,
                cash: amount,
                change: 0,
                discount: 0,
                grand_total: amount,
                status: 'pending'
            }
        });

        for (const item of cartItems) {
            await prisma.transactionDetail.create({
                data: {
                    transaction_id: transactionDb.id,
                    product_id: parseInt(item.product_id),
                    qty: parseInt(item.qty),
                    price: parseFloat(item.price)
                }
            });
        }

        // format items according to midtrans specification
        const itemDetails = cartItems.map(item => ({
            id: item.product_id.toString(),
            price: item.price,
            quantity: item.qty,
            name: item.title.substring(0, 50) // midtrans max length 50
        }));

        const parameter = {
            transaction_details: {
                order_id: invoiceId,
                gross_amount: amount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: customerName,
                email: customerEmail,
                phone: customerPhone
            },
            item_details: itemDetails
        };

        const transaction = await snap.createTransaction(parameter);

        await prisma.transaction.update({
            where: { id: transactionDb.id },
            data: { snap_token: transaction.token }
        });

        res.status(200).json({
            meta: {
                success: true,
                message: 'Snap transaction created successfully'
            },
            data: {
                token: transaction.token,
                redirect_url: transaction.redirect_url,
                invoice: invoiceId
            }
        });

    } catch (error) {
        console.error('Midtrans Snap Error:', error);
        res.status(500).json({
            meta: {
                success: false,
                message: 'Failed to create midtrans transaction'
            },
            errors: error.message
        });
    }
};

const handleNotification = async (req, res) => {
    try {
        let snap = new midtransClient.Snap({
            isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        });

        const statusResponse = await snap.transaction.notification(req.body);
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        const transaction = await prisma.transaction.findUnique({
            where: { invoice: orderId },
            include: { transaction_details: { include: { product: true } } }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                // challenge
            } else if (fraudStatus == 'accept') {
                await processSettlement(transaction);
            }
        } else if (transactionStatus == 'settlement') {
            await processSettlement(transaction);
        } else if (transactionStatus == 'cancel' ||
            transactionStatus == 'deny' ||
            transactionStatus == 'expire') {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'failed' }
            });
        } else if (transactionStatus == 'pending') {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'pending' }
            });
        }
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Midtrans Webhook Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function processSettlement(transaction) {
    if (transaction.status === 'success') return;

    await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'success' }
    });

    for (const detail of transaction.transaction_details) {
        const totalBuyPrice = detail.product.buy_price * detail.qty;
        const totalSellPrice = detail.product.sell_price * detail.qty;
        const profit = totalSellPrice - totalBuyPrice;

        await prisma.profit.create({
            data: {
                transaction_id: transaction.id,
                total: profit,
            },
        });

        await prisma.product.update({
            where: { id: detail.product_id },
            data: { stock: { decrement: detail.qty } },
        });
    }
}

const getTransactionStatus = async (req, res) => {
    try {
        const { invoice } = req.query;
        if (!invoice) {
            return res.status(400).json({ meta: { success: false, message: 'Invoice diperlukan' } });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { invoice },
            select: { id: true, invoice: true, status: true, grand_total: true, created_at: true }
        });

        if (!transaction) {
            return res.status(404).json({ meta: { success: false, message: 'Transaksi tidak ditemukan' } });
        }

        res.status(200).json({
            meta: { success: true, message: 'Status transaksi berhasil diambil' },
            data: transaction
        });
    } catch (error) {
        console.error('GetTransactionStatus Error:', error);
        res.status(500).json({ meta: { success: false, message: 'Internal server error' } });
    }
};

module.exports = { createSnapTransaction, handleNotification, getTransactionStatus };
