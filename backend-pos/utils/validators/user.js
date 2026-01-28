const { body } = require('express-validator');
const prisma = require('../../prisma/client');

// Define validasi for create dan update user
const validateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Email is Invalid')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Email is Required')
            }

            // For update operations, kecualikan current user ID dari email uniquness check
            const user = await prisma.user.findFirst({
                where: {
                    email: value,
                    NOT: {
                        id: Number(req.params.id) || undefined
                    }
                }
            });

            if (user) {
                throw new Error('Email Already Exist');
            }
            return true;
        }),

    // Conditional validasi untuk password
    body('password').if((value, { req }) => req.method === 'POST')
        .notEmpty().withMessage('Password is Required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('password').if((value, { req }) => req.method === 'PUT')
        .optional(),
];

module.exports = { validateUser }