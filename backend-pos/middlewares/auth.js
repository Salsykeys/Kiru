// Import
const express = require('express');
const jwt = require('jsonwebtoken');

// Verif token
const verifyToken = (req, res, next) => {
    // ambil token dari header 'authorization'
    const token = req.headers['authorization'];

    // kirim response tidak terautentikasi
    if (!token) return res.status(401).json({ message: 'Tidak Terautentikasi' });

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // send response tidak valid
        if (err) return res.status(401).json({ message: 'Token Tidak Valid' });

        // Simpan ID pengguna dari token => request
        req.userId = decoded.id;

        next();
    });         
};

module.exports = verifyToken;