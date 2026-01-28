// Imports
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Storage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // => 'uploads'
    },

    filename: (req, file, cb) => {
        // hashing
        const filehash = crypto.randomBytes(16).toString('hex');
        // ambil extension
        const ext = path.extname(file.originalname).toLowerCase();
        // susun file +=> hash && extension
        cb(null, `${filehash}${ext}`);
    },
});

// Filter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Check
    if(allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Ekstensi gambar tidak valid'), false);
    }
};

const upload = multer ({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //5MB
})

module.exports = upload;