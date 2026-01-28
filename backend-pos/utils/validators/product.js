// Imports
const { body, check } = require('express-validator');
const prisma = require('../../prisma/client');

const validateProduct = [
    body('barcode')
        .notEmpty().withMessage('Barcode is Required')
        .custom(async (barcode, { req }) => {
            const existingProduct = await prisma.product.findFirst({
                where: { barcode: barcode },
            });

            if(existingProduct && (!req.params.id || existingProduct.id !== parseInt(req.params.id))) {
                throw new Error('Barcode must be unique');
            }

            return true;
        }),

        body("category_id").notEmpty().withMessage("Category is required"),
        body("title").notEmpty().withMessage("Title is required"),
        body("description").notEmpty().withMessage("Description is required"),
        check('image').custom((value, { req }) => {
            if(req.method === 'POST' && !req.file) {
                throw new Error('Image is Required')
            }
            return true;
        }),

        body('buy_price').notEmpty().withMessage('Buy Price is Required'),
        body('sell_price').notEmpty().withMessage('Sell price is Required'),
        body('stock').notEmpty().withMessage('Stock is Required'),
];

module.exports = { validateProduct };