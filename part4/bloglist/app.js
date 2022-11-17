const express = require("express");
const config = require("./utils/config");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blog");
const cors = require("cors");
const logger = require("./utils/logger");

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

module.exports = app;
