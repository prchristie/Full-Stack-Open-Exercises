const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("all blogs are returned from get request", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("blogs have their unique identifier in property id", async () => {
  const response = await api.get("/api/blogs");

  response.body.map((blog) => expect(blog.id).toBeDefined());
});

test("a valid blog is created", async () => {
  const newBlog = {
    title: "Hello World!",
    author: "John Dorian",
    url: "https://www.stackoverflow.com",
    likes: 10,
  };
  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  const notesAtEnd = await helper.blogsInDb();
  expect(notesAtEnd.length).toBe(helper.initialBlogs.length + 1);
  expect(response.body).toEqual({
    title: "Hello World!",
    author: "John Dorian",
    url: "https://www.stackoverflow.com",
    likes: 10,
    id: response.body.id,
  });
});

test("blogs default to 0 likes when created without a like amount", async () => {
  const newBlog = {
    title: "New Title",
    author: "Author",
    url: "https://stackoverflow.com",
  };
  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  expect(response.body.likes).toBe(0);
});

test("a blog without a title is responded with 400 bad request", async () => {
  const newBlog = {
    author: "John Dorian",
    url: "https://www.stackoverflow.com",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});
test("a blog without a url is responded with 400 bad request", async () => {
  const newBlog = {
    title: "New Title",
    author: "John Dorian",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
