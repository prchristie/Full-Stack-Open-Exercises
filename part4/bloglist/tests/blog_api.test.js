const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./blog_api_test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  await Blog.insertMany(helper.initialBlogs);
});

describe("when getting blogs", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test("blogs have their unique identifier in property id", async () => {
    const response = await api.get("/api/blogs");

    response.body.map((blog) => expect(blog.id).toBeDefined());
  });
});

describe("creating a new blog", () => {
  const newBlog = {
    title: "Hello World!",
    author: "John Dorian",
    url: "https://www.stackoverflow.com",
    likes: 10,
  };

  test("succeeds with a valid blog", async () => {
    const response = await api.post("/api/blogs").send(newBlog).expect(201);

    const notesAtEnd = await helper.blogsInDb();
    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(response.body).toEqual({
      title: "Hello World!",
      author: "John Dorian",
      url: "https://www.stackoverflow.com",
      likes: 10,
      id: response.body.id,
    });
  });

  test("returns the new blog", async () => {});

  test("defaults to 0 likes when created without a likes amount", async () => {
    const noLikesBlog = {
      title: "Hello World!",
      author: "John Dorian",
      url: "https://www.stackoverflow.com",
    };

    const response = await api.post("/api/blogs").send(noLikesBlog).expect(201);

    expect(response.body.likes).toBe(0);
  });

  test("fails with status code 400 without a title", async () => {
    const newBlog = {
      author: "John Dorian",
      url: "https://www.stackoverflow.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("fails with status code 400 without a url", async () => {
    const newBlog = {
      title: "New Title",
      author: "John Dorian",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("deletion of a note", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const ids = blogsAtEnd.map((n) => n.id);
    expect(ids).not.toContain(blogToDelete.id);
  });

  test("succeeds with status code 204 even if the id doesn't exist", async () => {
    const id = await helper.nonExistingId();

    await api.delete(`/api/blogs/${id}`).expect(204);

    expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "Invalid";

    await api.delete(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("updating an existing note", () => {
  const updateBlog = {
    title: "New Title",
    author: "Bob Smith",
    url: "https://facebook.com",
    likes: 12345,
  };
  test("succeeds with status code 200 if valid blog", async () => {
    const blogToUpdate = await helper.firstBlog();

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateBlog)
      .expect(200);
    const updatedBlogFromApi = response.body;

    const updatedBlogFromDb = await helper.firstBlog();

    expect(updatedBlogFromApi).toEqual(updatedBlogFromDb);
    expect(updatedBlogFromApi.likes).toBe(updateBlog.likes);
    expect(updatedBlogFromDb.likes).toBe(updateBlog.likes);
  });

  test("fails with status code 404 if blog doesn't exist", async () => {
    const nonExistingId = await helper.nonExistingId();
    await api.put(`/api/blogs/${nonExistingId}`).expect(404);
  });
});
afterAll(() => {
  mongoose.connection.close();
});
