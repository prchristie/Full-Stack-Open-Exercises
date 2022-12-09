const invalidIdErrorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  }
  console.log(error.stack);

  next(error);
};

module.exports = invalidIdErrorHandler;
