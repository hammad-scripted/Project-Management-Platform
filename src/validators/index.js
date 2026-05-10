import { body } from 'express-validator';

export const userRegisterValidator = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .notEmpty()
      .withMessage('Email is required'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLowercase()
      .withMessage('Username must be in lowercase')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters long'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role').optional().trim(),
    body('fullName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Full name must be at most 100 characters long'),
  ];
};
