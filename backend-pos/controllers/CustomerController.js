const express = require("express");
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const customer = await prisma.customer.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                no_telp: req.body.no_telp,
                address: req.body.address,
            },
        });

        res.status(201).send({
            meta: {
                success: true,
                message: 'Registrasi Berhasil',
            },
            data: customer,
        });
    } catch (error) {
        console.error("REGISTER_ERROR:", error);

        if (error.code === 'P2002') {
            return res.status(422).send({
                meta: {
                    success: false,
                    message: 'Email sudah terdaftar. Silahkan gunakan email lain.',
                },
                errors: [
                    { path: 'email', msg: 'Email sudah terdaftar' }
                ]
            });
        }

        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error: ' + error.message,
            },
            errors: [],
        })
    }
};

const login = async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (!customer) return res.status(404).json({
            success: false,
            message: 'Email tidak ditemukan'
        });

        const validPassword = await bcrypt.compare(req.body.password, customer.password);
        if (!validPassword) return res.status(401).json({
            success: false,
            message: 'Password salah',
        });

        const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, {
            expiresIn: '3h'
        });

        const { password, ...customerData } = customer;

        res.status(200).send({
            meta: {
                success: true,
                message: 'Login berhasil',
            },
            data: {
                customer: customerData,
                token: token,
            },
        });
    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        res.status(500).send({
            meta: {
                success: false,
                message: 'Terjadi kesalahan pada server: ' + error.message,
            },
            errors: [],
        });
    }
}

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
        const hashedPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : await bcrypt.hash('password123', 10);
        const customer = await prisma.customer.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
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

        const customer = await prisma.customer.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                email: true,
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
        const data = {
            name: req.body.name,
            email: req.body.email,
            no_telp: req.body.no_telp,
            address: req.body.address,
            updated_at: new Date(),
        };

        if (req.body.password) {
            data.password = await bcrypt.hash(req.body.password, 10);
        }

        const customer = await prisma.customer.update({
            where: {
                id: Number(id),
            },
            data: data,
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
                points: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        const formattedCustomers = customers.map(customers => ({
            value: customers.id,
            label: customers.name,
            points: customers.points,
        }));

        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil mendapatkan semua data pelanggan',
            },
            data: formattedCustomers,
        });

    } catch (error) {
        console.error("ALL_CUSTOMERS_ERROR:", error);
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error: ' + error.message,
            },
            errors: error.message
        })
    }
}

const getCustomerTransactions = async (req, res) => {
    console.log("--> API_REQUEST: GET_CUSTOMER_TRANSACTIONS | userId:", req.userId, "type:", typeof req.userId);

    try {
        if (!req.userId) {
            console.error("--> ERROR: Missing userId in request");
            return res.status(401).send({
                meta: {
                    success: false,
                    message: 'Unauthorized: Sesi Anda sudah habis atau tidak valid.',
                },
            });
        }

        const uId = Number(req.userId);
        if (isNaN(uId)) {
            console.error("--> ERROR: Invalid userId format:", req.userId);
            return res.status(400).send({
                meta: {
                    success: false,
                    message: `ID Pengguna tidak valid: ${req.userId}`,
                },
            });
        }

        // Pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        console.log(`--> QUERY_PRISMA: findMany (page ${page}, limit ${limit}) for customerId:`, uId);

        const transactions = await prisma.transaction.findMany({
            where: {
                customer_id: uId,
            },
            include: {
                transaction_details: {
                    include: {
                        product: true
                    }
                },
            },
            orderBy: {
                id: 'desc',
            },
            skip: skip,
            take: limit
        });

        const totalTransactions = await prisma.transaction.count({
            where: {
                customer_id: uId,
            },
        });

        // Calculate total spent for points
        const aggregate = await prisma.transaction.aggregate({
            where: {
                customer_id: uId,
                status: 'success' // only count successful transactions for points
            },
            _sum: {
                grand_total: true
            }
        });

        const totalSpent = aggregate._sum.grand_total || 0;
        const totalPages = Math.ceil(totalTransactions / limit);

        const customer = await prisma.customer.findUnique({
            where: { id: uId },
            select: { points: true }
        });

        console.log(`--> SUCCESS: Found ${transactions.length} transactions for user ${uId}`);
        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil mendapatkan riwayat transaksi',
            },
            data: transactions,
            total_spent: totalSpent,
            customer_points: customer ? customer.points : 0,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                perPage: limit,
                total: totalTransactions,
            },
        });
    } catch (error) {
        console.error("--> CRITICAL_ERROR: getCustomerTransactions failed", error);
        res.status(500).send({
            meta: {
                success: false,
                message: `Kesalahan Server Interner: ${error.name} - ${error.message}`,
            }
        });
    }
}

module.exports = { findCustomer, createCustomer, findCustomerById, updateCustomer, deleteCustomer, allCustomers, register, login, getCustomerTransactions };