const express = require("express");
const prisma = require("../prisma/client");

const findCustomer = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
            select: {
                id: true,
                name: true,
                no_telp: true,
                address: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: {
                id: 'desc',
            },
            skip: skip,
            take: limit,
        });

        const totalCustomers = await prisma.customer.count({
            where: {
                name: {
                    contains: search,
                },
            },
        });

        const totalPages = Math.ceil(totalCustomers / limit);

        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil mendapatkan semua pelanggan'
            },
            data: customers,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                perPage: limit,
                total: totalCustomers,
            },
        });
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

const createCustomer = async (req, res) => {
    try {
        const customer = await prisma.customer.create({
            data: {
                name: req.body.name,
                no_telp: req.body.no_telp,
                address: req.body.address,
            },
        });

        res.status(201).send({
            meta: {
                success: true,
                message: 'Pelanggan berhasil dibuat',
            },
            data: customer,
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error'
            },
            errors: error,
        })
    }
};

const findCustomerById = async (req, res) => {
    const { id } = req.params

    try {

        const customer = await prisma.customer.findMany({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                no_telp: true,
                address: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!customer) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Pelanggan dengan id ${id}, tidak ditemukan`,
                },
            });
        }

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil mendapatkan pelanggan dengan id ${id}`
            },
            data: customer,
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error',
            },
        });
    }
};

const updateCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await prisma.customer.update({
            where: {
                id: Number(id),
            },
            data: {
                name: req.body.name,
                no_telp: req.body.no_telp,
                address: req.body.address,
                created_at: new Date(),
            },
        });

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil mengupdate pelanggan dengan id ${id}`
            },
            data: customer,
        })

    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error',
            },
            errors: error,
        })
    }
}

const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {

        const customer = await prisma.customer.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!customer) {
            res.status(404).send({
                meta: {
                    success: false,
                    message: `Pelanggan dengan id ${id} tidak ditemukan`,
                },
            });
        }

        await prisma.customer.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil menghapus pelanggan`,
            },
        });
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

const allCustomers = async (req, res) => {
    try {

        const customers = await prisma.customer.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        const formattedCustomers = customers.map(customers => ({
            value: customers.id,
            label: customers.name
        }));

        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil mendapatkan semua data pelanggan',
            },
            data: formattedCustomers,
        });

    } catch (error) {
        res.status(500).send({
            meta: {
                success: true,
                message: 'Internal server error',
            },
            errors: error
        })
    }
}

module.exports = { findCustomer, createCustomer, findCustomerById, updateCustomer, deleteCustomer, allCustomers };