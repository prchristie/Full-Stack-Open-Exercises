const express = require("express");
const config = require("./utils/config");
const app = express();
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blog");

const cors = require("cors");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
