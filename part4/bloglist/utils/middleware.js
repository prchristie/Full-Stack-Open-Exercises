const jwt = require("jsonwebtoken");
const User = require("../models/user");

const invalidIdErrorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message,
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  }

  next(error);
};

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request);

  request.token = token;

  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    var decodedToken = null;
    try {
      decodedToken = jwt.verify(request.token, process.env.SECRET);
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return response.status(401).json({ error: "token expired" });
      }

      throw e;
    }

    if (!decodedToken.id) {
      return response.status(401).json({
        error: "invalid token",
      });
    }

    const user = await User.findById(decodedToken.id);

    request.user = user;
  }

  next();
};

const unknownEndpoint = (request, response) => {
  console.log("bye");
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
  invalidIdErrorHandler,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
};
