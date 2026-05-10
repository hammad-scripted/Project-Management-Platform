import { validationResult } from 'express-validator';
import ApiError from '../utils/api-error';
import equals from './../../node_modules/validator/es/lib/equals';

// *Validation middleware-this code is a template for validating incoming requests using express-validator. It checks for validation errors and if any are found, it extracts the error messages and passes them to the next middleware as an ApiError with a 422 status code. If there are no validation errors, it simply calls next() to proceed to the next middleware or route handler.
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  } else {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    return next(new ApiError('Validation Error', 422, extractedErrors));
  }
};
