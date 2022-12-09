const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username) {
    return response.status(400).json({
      error: "username required",
    });
  }
  if (!password) {
    return response.status(400).json({
      error: "password required",
    });
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: "username must be at least 3 characters",
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters",
    });
  }

  const saltRounds = 10;
  const pwHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    password: pwHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (e) {
    if (e.name === "MongoServerError") {
      response.status(400).json({
        error: "username must be unique",
      });
    }
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });

  response.json(users);
});

module.exports = usersRouter;
