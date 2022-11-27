const express = require("express");
require("express-async-errors");
const config = require("./utils/config");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blog");
const cors = require("cors");
const logger = require("./utils/logger");
const invalidIdErrorHandler = require("./utils/middleware");

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

app.use("/api/blogs", blogsRouter);

app.use(invalidIdErrorHandler);

module.exports = app;
