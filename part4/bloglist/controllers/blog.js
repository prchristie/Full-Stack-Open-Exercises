const Blog = require("../models/blog");
const User = require("../models/user");
const blogRouter = require("express").Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const user = User.find({}).sort({ createdAt: -1 })[0];
  const blog = new Blog({ title, author, url, likes, user: user.id });

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (e) {
    if (e.name === "ValidationError") {
      response.status(400).end();
    } else {
      throw e;
    }
  }
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  if (!updatedBlog) {
    response.status(404).end();
  }
  response.json(updatedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
