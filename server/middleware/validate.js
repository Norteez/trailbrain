function validateTripRequest(req, res, next) {
  const { query } = req.body;
  if (!query || typeof query !== 'string' || query.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'A trip description (query) of at least 5 characters is required.',
    });
  }
  next();
}

module.exports = { validateTripRequest };
