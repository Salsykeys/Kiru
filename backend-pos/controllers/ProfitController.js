const express = require("express");
const prisma = require("../prisma/client");
const excelJS = require('exceljs');
const { moneyFormat } = require('../utils/moneyFormat');

const filterProfit = async (req, res) => {
    try {
        const startDate = new Date(req.query.start_date);
        const endDate = new Date(req.query.end_date);
        endDate.setHours(23, 59, 59, 999);

        const profits = await prisma.profit.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate
                },
            },
            include: {
                transaction: {
                    select: {
                        id: true,
                        invoice: true,
                        grand_total: true,
                        created_at: true,
                    },
                },
            },
        });

        const total = await prisma.profit.aggregate({
            _sum: {
                total: true,
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
                message: `Data profit dari ${req.query.start_date}, hingga ${req.query.end_date} berhasil diambil`,
            },
            data: {
                profits: profits,
                total: total._sum.total || 0,
            }
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

const exportProfit = async (req, res) => {
    try {
        const startDate = new Date(req.query.start_date);
        const endDate = new Date(req.query.end_date);
        endDate.setHours(23, 59, 59, 999);

        const profits = await prisma.profit.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate
                },
            },
            include: {
                transaction: {
                    select: {
                        id: true,
                        invoice: true,
                    }
                },
            },
        });

        const total = await prisma.profit.aggregate({
            _sum: {
                total: true,
            },
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('Profits');

        workSheet.columns = [
            { header: 'DATE', key: 'created_at', width: 10 },
            { header: 'INVOICE', key: 'invoice', width: 20 },
            { header: 'TOTAL', key: 'total', width: 20 },
        ];

        workSheet.columns.forEach((col) => {
            col.style = {
                font: { bold: true, },
                alignment: { horizontal: "center" },
                border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                },
            } ;
        });

        profits.forEach((profit) => {
            workSheet.addRow({
                created_at: profit.created_at,
                invoice: profit.transaction.invoice,
                total: moneyFormat(profit.total),
            });
        });

        const totalRow = workSheet.addRow({
            created_at: '',
            invoice: 'TOTAL',
            total: `${moneyFormat(total._sum.total)}`,
        });

        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, };
            cell.alignment = { horizontal: 'right' };
            if(colNumber === 3) {
                cell.alignment = { horizontal: 'center'}; 
            }
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
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

module.exports = { filterProfit, exportProfit };