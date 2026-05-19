function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected error occurred.',
  });
}

module.exports = { errorHandler };
