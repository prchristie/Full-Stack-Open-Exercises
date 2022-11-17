const express = require("express");
const config = require("./utils/config");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

module.exports = app;
