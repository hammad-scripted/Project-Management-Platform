import ApiResponse from '../utils/api-response.js';
import asyncHandler from '../utils/async-handler.js';
/**
 * `
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 

const healthCheck = async (req, res, next) => {
  try {
    return res.status(200).json(
      new ApiResponse(200, {
        message: "Server is healthy and up and running",
      }),
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

*/
const healthCheck = asyncHandler(async (req, res, next) => {
  return res.status(200).json(
    new ApiResponse(200, {
      message: 'Server is healthy & up and running',
    }),
  );
});

export default healthCheck;
