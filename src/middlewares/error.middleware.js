const errorHandler = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    success: err.success,
    message: err.message,
    errors: err.errors,
    data: err.data,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
