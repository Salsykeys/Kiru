const express = require("express");
const prisma = require("../prisma/client");
const { format, subDays } = require('date-fns');

const getDashboardData = async (req, res) => {
    try {
        const today = new Date();
        const week = subDays(today, 6); // Last 7 days including today

        // Get dashboard statistics in parallel
        const [
            transactionsWeek,
            profitsWeek,
            countSalesToday,
            sumSalesToday,
            sumProfitsToday,
            productsLimitStock,
            chartBestProduct
        ] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    created_at: {
                        gte: new Date(week.setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.profit.findMany({
                where: {
                    created_at: {
                        gte: new Date(week.setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.transaction.count({
                where: {
                    created_at: {
                        gte: new Date(`${today.toISOString().split('T')[0]}T00:00:00.000Z`),
                        lte: new Date(`${today.toISOString().split('T')[0]}T23:59:59.999Z`),
                    },
                },
            }),
            prisma.transaction.aggregate({
                _sum: { grand_total: true },
                where: {
                    created_at: {
                        gte: new Date(`${today.toISOString().split('T')[0]}T00:00:00.000Z`),
                        lte: new Date(`${today.toISOString().split('T')[0]}T23:59:59.999Z`),
                    },
                },
            }),
            prisma.profit.aggregate({
                _sum: { total: true },
                where: {
                    created_at: {
                        gte: new Date(`${today.toISOString().split('T')[0]}T00:00:00.000Z`),
                        lte: new Date(`${today.toISOString().split('T')[0]}T23:59:59.999Z`),
                    },
                },
            }),
            prisma.product.findMany({
                where: { stock: { lte: 10 } },
                include: { category: true },
            }),
            prisma.transactionDetail.groupBy({
                by: ['product_id'],
                _sum: { qty: true },
                orderBy: { _sum: { qty: 'desc' } },
                take: 5,
            })
        ]);

        const salesByDate = {};
        const profitsByDate = {};

        // Initialize last 7 days with 0
        for (let i = 0; i < 7; i++) {
            const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
            salesByDate[dateStr] = 0;
            profitsByDate[dateStr] = 0;
        }

        let sumSalesWeek = 0;
        transactionsWeek.forEach(transaction => {
            const dateStr = format(new Date(transaction.created_at), 'yyyy-MM-dd');
            if (salesByDate[dateStr] !== undefined) {
                salesByDate[dateStr] += transaction.grand_total;
            }
            sumSalesWeek += transaction.grand_total;
        });

        let sumProfitsWeek = 0;
        profitsWeek.forEach(profit => {
            const dateStr = format(new Date(profit.created_at), 'yyyy-MM-dd');
            if (profitsByDate[dateStr] !== undefined) {
                profitsByDate[dateStr] += profit.total;
            }
            sumProfitsWeek += profit.total;
        });

        // Convert to arrays and sort by date
        const sortedDates = Object.keys(salesByDate).sort();
        const sales_date = sortedDates;
        const sales_total = sortedDates.map(date => parseInt(salesByDate[date]));

        const profits_date = sortedDates;
        const profits_total = sortedDates.map(date => parseInt(profitsByDate[date]));

        // Get product details for best selling products
        const productIds = chartBestProduct.map(item => item.product_id);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, title: true },
        });

        const bestSellingProducts = chartBestProduct.map(item => {
            const product = products.find(p => p.id === item.product_id);
            return {
                title: product?.title || 'Unknown Product',
                total: item._sum.qty || 0,
            };
        });

        res.status(200).json({
            meta: {
                success: true,
                message: 'Data dashboard berhasil diambil',
            },
            data: {
                count_sales_today: countSalesToday,
                sum_sales_today: sumSalesToday._sum.grand_total || 0,
                sum_sales_week: sumSalesWeek || 0,
                sum_profits_today: sumProfitsToday._sum.total || 0,
                sum_profits_week: sumProfitsWeek || 0,
                sales: {
                    sales_date,
                    sales_total,
                },
                profits: {
                    profits_date,
                    profits_total,
                },
                products_limit_stock: productsLimitStock,
                best_selling_products: bestSellingProducts,
            },
        });

    } catch (error) {
        res.status(500).json({
            meta: {
                success: false,
                message: 'Internal server error'
            },
            errors: error.message,
        })
    }
}

module.exports = { getDashboardData };