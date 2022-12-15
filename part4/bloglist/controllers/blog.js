const Blog = require("../models/blog");
const blogRouter = require("express").Router();

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "missing token" });
  }

  const blog = new Blog({ title, author, url, likes, user: user._id });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
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
  const id = request.params.id;
  const user = request.user;
  console.log(user);

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
