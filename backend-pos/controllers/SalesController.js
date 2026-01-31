const express = require('express');
const prisma = require('../prisma/client');
const excelJS = require('exceljs');
const { moneyFormat } = require('../utils/moneyFormat');

const filterSales = async (req, res) => {

    try {
        const startDate = new Date(req.query.start_date);
        const endDate = new Date(req.query.end_date);
        endDate.setHours(23, 59, 59, 999);

        const sales = await prisma.transaction.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                cashier: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        const total = await prisma.transaction.aggregate({
            _sum: {
                grand_total: true,
            },
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        res.status(200).json({
            meta: {
                success: true,
                message: `Data penjualan dari ${req.query.start_date} hingga ${req.query.end_date} berhasil diambil`,
            },
            data: {
                sales: sales,
                total: total._sum.grand_total || 0,
            },
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

const exportSales = async (req, res) => {
    try {
        const startDate = new Date(req.query.start_date);
        const endDate = new Date(req.query.end_date);
        endDate.setHours(23, 59, 59, 999);

        const sales = await prisma.transaction.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                cashier: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        const total = await prisma.transaction.aggregate({
            _sum: {
                grand_total: true,
            },
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('Sales');

        // Header Styling
        workSheet.columns = [
            { header: 'DATE', key: 'created_at', width: 25 },
            { header: 'INVOICE', key: 'invoice', width: 30 },
            { header: 'CASHIER', key: 'cashier', width: 15 },
            { header: 'CUSTOMER', key: 'customer', width: 15 },
            { header: 'TOTAL', key: 'grand_total', width: 15 },
        ];

        workSheet.columns.forEach((col) => {
            col.style = {
                font: { bold: true, },
                alignment: { horizontal: 'center' },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                },
            };
        });

        // Add sales data
        sales.forEach((sale) => {
            workSheet.addRow({
                created_at: sale.created_at,
                invoice: sale.invoice,
                cashier: sale.cashier.name,
                customer: sale.customer?.name || 'Umum',
                grand_total: `${moneyFormat(sale.grand_total)}`,
            });
        });

        const totalRow = workSheet.addRow({
            created_at: '',
            invoice: '',
            cashier: '',
            customer: 'total',
            grand_total: `${moneyFormat(total._sum.grand_total)}`,
        });

        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'right' };
            if (colNumber === 5) {
                cell.alignment = { horizontal: 'center' };
            }
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        workBook.xlsx.write(res);

    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error'
            },
            errors: error,
        })
    }
}

module.exports = { filterSales, exportSales };