// Imports
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const crypto = require('crypto');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Setup Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'kiru-pos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        public_id: (req, file) => {
            const filehash = crypto.randomBytes(16).toString('hex');
            return filehash;
        }
    },
});

// Filter
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Ekstensi gambar tidak valid'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //5MB
})

module.exports = upload;