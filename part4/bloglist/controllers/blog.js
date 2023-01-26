const Blog = require("../models/blog");
const { requireAuth } = require("../utils/middleware");
const blogRouter = require("express").Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogRouter.post("/", requireAuth, async (request, response) => {
  const user = request.user;

  const { title, author, url, likes } = request.body;

  const blog = new Blog({ title, author, url, likes, user: user._id });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    user: body.user,
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate("user", {username: 1, name: 1});
  if (!updatedBlog) {
    response.status(404).end();
  }
  response.json(updatedBlog);
});

blogRouter.delete("/:id", requireAuth, async (request, response) => {
  const id = request.params.id;
  const user = request.user;

  const blog = await Blog.findById(id);

  if (blog.user._id.toString() !== user.id) {
    return response.status(401).json({
      error: "user doesn't own blog",
    });
  }

  blog.delete();

  response.status(204).end();
});

module.exports = blogRouter;
