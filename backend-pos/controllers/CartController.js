const express = require("express");
const prisma = require("../prisma/client");

const findCarts = async (req, res) => {
    try {
        const carts = await prisma.cart.findMany({
            select: {
                id: true,
                cashier_id: true,
                product_id: true,
                qty: true,
                price: true,
                created_at: true,
                updated_at: true,
                product: {
                    select: {
                        id: true,
                        title: true,
                        buy_price: true,
                        sell_price: true,
                        image: true,
                    },
                },
                cashier: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            where: {
                cashier_id: parseInt(req.userId),
            },
            orderBy: {
                id: 'desc',
            },
        });

        const totalPrice = carts.reduce((sum, cart) => sum + cart.price, 0);

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil mendapatkan semua keranjang oleh kasir ${req.userId}`,
            },
            data: carts,
            totalPrice: totalPrice,
        });

    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error',
            },
            errors: error,
        });
    }
};

const createCart = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(req.body.product_id),
            },
        });

        if(!product) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Produk dengan id ${req.body.product_id} tidak ditemukan`,
                },
            });
        };

        const existingCart = await prisma.cart.findFirst({
            where: {
                product_id: parseInt(req.body.product_id),
                cashier_id: req.userId,
            },
        });

        if(existingCart) {
            const updatedCart = await prisma.cart.update({
                where: {
                    id: existingCart.id,
                },
                data: {
                    qty: existingCart.qty + parseInt(req.body.qty),
                    price: product.sell_price * (existingCart.qty + parseInt(req.body.qty)),
                    updated_at: new Date(),
                },
                include: {
                    product:true,
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            return res.status(200).send({
                meta: {
                    success: true,
                    message: 'Jumlah keranjang berhasil diperbarui',
                },
                data: updatedCart,
            });
        } else {
            const cart = await prisma.cart.create({
                data: {
                    cashier_id: req.userId,
                    product_id: parseInt(req.body.product_id),
                    qty: parseInt(req.body.qty),
                    price: product.sell_price * parseInt(req.body.qty),
                },
                include: {
                    product: true,
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            return res.status(201).send({
                meta: {
                    success: true,
                    message: 'Keranjang berhasil dibuat',
                },
                data: cart,
            });
        }
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error',
            },
            errors: error,
        })
    }
};

const deleteCart = async (req, res) => {
    const { id } = req.params;

    try {
        const cart = await prisma.cart.findUnique({
            where: {
                id: Number(id),
                cashier_id: parseInt(req.userId),
            },
        });

        if(!cart) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Keranjang dengan id ${id} tidak ditemukan`,
                },
            });
        };

        await prisma.cart.delete({
            where: {
                id: Number(id),
                cashier_id: parseInt(req.userId),
            },
        });

        res.status(200).send({
            meta: {
                success: true,
                message: 'Keranjang berhasil dihapus',
            },
        });

    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error',
            },
        });
    }
}

module.exports = { findCarts, createCart, deleteCart };