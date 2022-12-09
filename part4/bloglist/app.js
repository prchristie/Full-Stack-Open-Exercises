const express = require("express");
require("express-async-errors");
const config = require("./utils/config");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const cors = require("cors");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const morgan = require("morgan");

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.invalidIdErrorHandler);

module.exports = app;
