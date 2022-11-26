const Blog = require("../models/blog");
const blogRouter = require("express").Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (e) {
    if (e.name === "ValidationError") {
      response.status(400).end();
    } else {
      next(e);
    }
  }
});

module.exports = blogRouter;
