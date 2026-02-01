const express = require("express");
const prisma = require("../prisma/client");
const { format, subDays } = require('date-fns');

const getDashboardData = async (req, res) => {
    try {
        const today = new Date();
        const week = subDays(today, 7);

        const chartSalesWeek = await prisma.transaction.groupBy({
            by: ['created_at'],
            _sum: {
                grand_total: true,
            },
            where: {
                created_at: {
                    gte: week,
                },
            },
        });

        let sales_date = [];
        let sales_total = [];
        let sumSalesWeek = 0;

        if (chartSalesWeek.length > 0) {
            chartSalesWeek.forEach(result => {
                sales_date.push(format(new Date(result.created_at), 'yyyy-MM-dd'));
                const total = parseInt(result._sum.grand_total || 0);
                sales_total.push(total);
                sumSalesWeek += total;
            });
        } else {
            sales_date.push('');
            sales_total.push(0);
        }

        const chartProfitsWeek = await prisma.profit.groupBy({
            by: ['created_at'],
            _sum: {
                total: true,
            },
            where: {
                created_at: {
                    gte: week,
                },
            },
        });

        let profits_date = [];
        let profits_total = [];
        let sumProfitsWeek = 0;

        if (chartProfitsWeek.length > 0) {
            chartProfitsWeek.forEach(result => {
                profits_date.push(format(new Date(result.created_at), 'yyyy-MM-dd'));
                const total = parseInt(result._sum.total || 0);
                profits_total.push(total);
                sumProfitsWeek += total;
            });
        } else {
            profits_date.push('');
            profits_total.push(0);
        }

        const countSalesToday = await prisma.transaction.count({
            where: {
                created_at: {
                    gte: new Date(`${today.toISOString().split('T')[0]}T00:00:00.000Z`),
                    lte: new Date(`${today.toISOString().split('T')[0]}T23:59:59.999Z`),
                },
            },
        });

        const sumSalesToday = await prisma.transaction.aggregate({
            _sum: {
                grand_total: true,
            },
            where: {
                created_at: {
                    gte: new Date(`${today.toISOString().split('T')[0]}T00:00:00.000Z`),
                    lte: new Date(`${today.toISOString().split('T')[0]}T23:59:59.999Z`),
                },
            },
        });

        const sumProfitsToday = await prisma.profit.aggregate({
            _sum: {
                total: true,
            },
            where: {
                created_at: {
                    gte: new Date(`${today.toISOString().split('T')[0]}T00:00:00.000Z`),
                    lte: new Date(`${today.toISOString().split('T')[0]}T23:59:59.999Z`),
                },
            },
        });

        const productsLimitStock = await prisma.product.findMany({
            where: {
                stock: {
                    lte: 10,
                },
            },
            include: {
                category: true,
            },
        });

        const chartBestProduct = await prisma.transactionDetail.groupBy({
            by: ['product_id'],
            _sum: {
                qty: true,
            },
            orderBy: {
                _sum: {
                    qty: 'desc',
                },
            },
            take: 5,
        });

        const productIds = chartBestProduct.map(item => item.product_id);

        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
            select: {
                id: true,
                title: true,
            },
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