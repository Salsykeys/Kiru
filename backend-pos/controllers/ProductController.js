const express = require('express');
const prisma = require('../prisma/client');
const fs = require('fs');

const findProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: search,
                },
            },

            select: {
                id: true,
                barcode: true,
                title: true,
                image: true,
                description: true,
                buy_price: true,
                sell_price: true,
                stock: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                id: 'desc',
            },
            skip: skip,
            take: limit
        });

        const totalProduct = await prisma.product.count({
            where: {
                title: {
                    contains: search,
                },
            },

        })
        const totalPages = Math.ceil(totalProduct / limit);

        res.status(200).send({
            meta: {
                success: true,
                message: 'Berhasil mengambil semua product'
            },
            data: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                perPage: limit,
                total: totalProduct,
            },
        })
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

const createProduct = async (req, res) => {
    try {
        const product = await prisma.product.create({
            data: {
                barcode: req.body.barcode,
                title: req.body.title,
                description: req.body.description,
                buy_price: parseInt(req.body.buy_price),
                sell_price: parseInt(req.body.sell_price),
                stock: parseInt(req.body.stock),
                image: req.file.path,
                category_id: parseInt(req.body.category_id),
            },
            include: {
                category: true,
            },
        });

        res.status(201).send({
            meta: {
                success: true,
                message: 'Product berhasil dibuat',
            },
            data: product,
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

const findProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                barcode: true,
                title: true,
                description: true,
                buy_price: true,
                sell_price: true,
                stock: true,
                image: true,
                category_id: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        name: true,
                        description: true,
                        image: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            }
        });

        if (!product) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Produk dengan id ${id} tidak ditemukan`,
                },
            });
        };

        res.status(200).send({
            meta: {
                success: true,
                message: `berhasil mengambil produk dengan id ${id}`,
            },
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            meta: {
                success: false,
                message: 'Internal server error'
            },
            errors: error,
        });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const dataProduct = {
            barcode: req.body.barcode,
            title: req.body.title,
            description: req.body.description,
            buy_price: parseInt(req.body.buy_price),
            sell_price: parseInt(req.body.sell_price),
            stock: parseInt(req.body.stock),
            category_id: parseInt(req.body.category_id),
            updated_at: new Date(),
        };

        if (req.file) {
            dataProduct.image = req.file.path;
            const product = await prisma.product.findUnique({
                where: {
                    id: Number(id),
                },
            });

            if (product.image) {
                fs.unlinkSync(product.image);
            }
        }

        const product = await prisma.product.update({
            where: {
                id: Number(id),
            },
            data: dataProduct,
        });

        res.status(200).send({
            meta: {
                success: true,
                message: 'Produk berhasil diperbarui',
            },
            data: product,
        });

    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server Error'
            },
            errors: error
        })
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!product) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Produk dengan id ${id} tidak ditemukan`,
                },
            });
        }

        await prisma.product.delete({
            where: {
                id: Number(id),
            },
        });

        if (product.image) {
            const imagePath = product.image;
            const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
            const filePath = `uploads/${fileName}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            };
        }

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil menghapus produk dengan id ${id}`,
            },
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
}

const findProductByCategoryId = async (req, res) => {
    const { id } = req.params;

    try {

        const page = (req.query.page) || 1;
        const limit = (req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const products = await prisma.product.findMany({
            where: {
                category_id: Number(id),
            },
            select: {
                id: true,
                barcode: true,
                title: true,
                description: true,
                buy_price: true,
                sell_price: true,
                stock: true,
                image: true,
                category_id: true,
                created_at: true,
                updated_at: true,
            },
            skip: skip,
            take: limit,
        });

        const totalProducts = await prisma.product.count({
            where: {
                category_id: Number(id),
            },
        });

        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil mengambil produk dengan Category Id ${id}`,
            },
            data: products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                perPage: limit,
                total: totalProducts,
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

const findProductByBarcode = async (req, res) => {

    try {
        const product = await prisma.product.findMany({
            where: {
                barcode: req.body.barcode,
            },
            select: {
                id: true,
                barcode: true,
                title: true,
                description: true,
                buy_price: true,
                sell_price: true,
                stock: true,
                image: true,
                category_id: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        name: true,
                        description: true,
                        image: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            }
        });

        if (!product) {
            return res.status(404).send({
                meta: {
                    success: false,
                    message: `Produk dengan barcode ${req.body.barcode} tidak ditemukan`,
                },
            });
        }

        res.status(200).send({
            meta: {
                success: true,
                message: `Berhasil mengambil produk dengan barcode ${req.body.barcode}`,
            },
            data: product,
        })
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Internal server error'
            },
            errors: error,
        });
    }
}

module.exports = { findProduct, createProduct, findProductById, updateProduct, deleteProduct, findProductByCategoryId, findProductByBarcode };