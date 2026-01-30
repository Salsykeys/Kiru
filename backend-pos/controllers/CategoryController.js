const express = require('express');
const prisma = require('../prisma/client');
const fs = require('fs');

const findCategories = async (req, res) => {
    try{
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
                message: 'Terjadi kesalahan di server'
            },
            errors: error,
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const categories = await prisma.category.create({
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
            data: categories,
        });
    } catch (error) {
        res.status(500).send({
            meta: {
                success: false,
                message: 'Terjadi kesalahan di server',
            },
            errors: error,
        });
    }
};

module.exports = { findCategories, createCategory };