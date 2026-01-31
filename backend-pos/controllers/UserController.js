// Imports
const express = require("express");
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");

const findUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const search = req.query.search || '';

        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: search,
                }
            },
            select: {
                id: true,
                name: true,
                email: true
            },
            orderBy: {
                id: 'desc',
            },
            skip: skip,
            take: limit,
        });

        const totalUsers = await prisma.user.count({
            where: {
                name: {
                    contains: search,
                }
            },
        });

        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil mengambil semua pengguna',
            },
            data: users,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                perPage: limit,
                total: totalUsers,
            },
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal Server Error'
            },
            errors: error,
        });
    }
};

const createUser = async (req, res) => {
    // hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        res.status(201).send({
            meta: {
                success: true,
                message: 'Pengguna berhasil dibuat',
            },
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal Server Error',
            },
            errors: error,
        });
    }
};

const findUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!user) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Pengguna dengan id ${id} tidak ditemukan`,
                },
            });
        }

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil mengambil pengguna dengan id ${id}`,
            },
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal Server Error',
            },
            errors: error,
        });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;

    let userData = {
        name: req.body.name,
        email: req.body.email,
        updated_at: new Date(),
    };

    try {
        // hash & update pw kalo butuh
        if (req.body.password !== '') {

            // hashing
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // + password => objek data
            userData.password = hashedPassword;
        }

        // update user
        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: userData,
        });

        res.status(200).send({
            meta: {
                success: true,
                message: 'Pengguna berhasil diperbarui'
            },
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal Server Error',
            },
            errors: error,
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        if (!user) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Gagal menghapus pengguna dengan id ${id}`
                },
            });
        }

        return res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil menghapus pengguna`
            },
        });
    } catch (error) {
        return res.status(500).send({
            meta: {
                success: false,
                message: 'Internal Server Error'
            },
            errors: error,
        });
    }
}

module.exports = { findUser, createUser, findUserById, updateUser, deleteUser };