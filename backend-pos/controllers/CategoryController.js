const express = require('express');
const prisma = require('../prisma/client');
const fs = require('fs');

const findCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const search = req.query.search || '';

        const categories = await prisma.category.findMany({
            where: {
                name: {
                    contains: search,
                }
            },
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: {
                id: 'desc',
            },
            skip: skip,
            take: limit,
        });

        const totalCategories = await prisma.category.count({
            where: {
                name: {
                    contains: search,
                }
            },
        });

        const totalPages = Math.ceil(totalCategories / limit);

        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil memanggil semua category',
            },
            data: categories,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                perPage: limit,
                total: totalCategories,
            },
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server Error'
            },
            errors: error,
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await prisma.category.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                image: req.file.path,
            },
        });

        res.status(201).send({
            meta: {
                success: true,
                message: 'Category berhasil dibuat',
            },
            data: category,
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server Error',
            },
            errors: error,
        });
    }
};

const findCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await prisma.category.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!category) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Kategori dengan id ${id} tidak ditemukan`,
                },
            });
        }

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil mengambil kategori dengan id ${id}`,
            },
            data: category,
        });
    } catch (error) {
        return res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server Error',
            },
            errors: error,
        });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const dataCategory = {
            name: req.body.name,
            description: req.body.description,
            updated_at: new Date(),
        }

        if (req.file) {
            dataCategory.image = req.file.path;
            const category = await prisma.category.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (category.image) {
                fs.unlinkSync(category.image);
            };
        };

        const category = await prisma.category.update({
            where: {
                id: Number(id),
            },
            data: dataCategory,
        });

        res.status(200).send({
            meta: {
                success: true,
                message: 'Kategori berhasil diperbarui'
            },
            data: category,
        });

    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server Error',
            },
            errors: error,
        });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await prisma.category.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!category) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Tidak bisa menemukan category dengan id ${id}`
                },
            });
        }

        await prisma.category.delete({
            where: {
                id: Number(id),
            },
        });

        if (category.image) {
            const imagePath = category.image;
            const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
            const filePath = `uploads/${fileName}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            };
        };

        return res.status(200).send({
            meta: {
                success: true,
                message: 'Kategori berhasil dihapus',
            },
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server Error',
            },
        });
    }
};

const allCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                description: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: {
                id: 'desc'
            },
        });

        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil mendapat semua kategori',
            },
            data: categories,
        });
    } catch (error) {
        return req.status(500).send({
            meta: {
                success: false,
                message: 'Internal server Error',
            },
            errors: error
        });
    }
};

module.exports = { findCategories, createCategory, findCategoryById, updateCategory, deleteCategory, allCategories };