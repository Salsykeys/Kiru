const { body, check } = require('express-validator');

// Define validasi untuk category dengan optional file
const validateCategory = [
    body('name')
        .notEmpty().withMessage('Name is Required'),

    check('image')
        .optional() 
        .custom((value, { req, }) => {
            // Check jika file is uploaded ketika creation atau update
            if (req.method === 'POST' && !req.file) {
                throw new Error('Image is Required');
            }
            return true;
        }),
    body('description')
        .notEmpty().withMessage('Description is Required'),
];

module.exports = { validateCategory };