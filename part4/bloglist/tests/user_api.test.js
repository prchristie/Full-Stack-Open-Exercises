const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./user_api_test_helper");
const mongoose = require("mongoose");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

describe("creating a new user", () => {
  test("fails with 400 without a username", async () => {
    const initialUsers = await helper.usersInDb();
    const newUser = {
      name: "Bob",
      password: "qwerty",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    expect(response.body.error).toBe("username required");

    const finalUsers = await helper.usersInDb();
    expect(initialUsers).toHaveLength(finalUsers.length);
  });

  test("fails with 400 without a password", async () => {
    const initialUsers = await helper.usersInDb();
    const newUser = {
      name: "Bob",
      username: "qwerty",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    expect(response.body.error).toBe("password required");

    const finalUsers = await helper.usersInDb();
    expect(initialUsers).toHaveLength(finalUsers.length);
  });

  test("fails with 400 if username length below 3", async () => {
    const initialUsers = await helper.usersInDb();
    const newUser = {
      name: "Bob",
      username: "a",
      password: "password123",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    expect(response.body.error).toBe("username must be at least 3 characters");

    const finalUsers = await helper.usersInDb();
    expect(initialUsers).toHaveLength(finalUsers.length);
  });

  test("fails with 400 if password length below 3", async () => {
    const initialUsers = await helper.usersInDb();
    const newUser = {
      name: "Bob",
      username: "qwerty",
      password: "a",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    expect(response.body.error).toBe("password must be at least 3 characters");

    const finalUsers = await helper.usersInDb();
    expect(initialUsers).toHaveLength(finalUsers.length);
  });

  test("fails with 400 if username is not unique", async () => {
    const initialUsers = await helper.usersInDb();
    const newUser = {
      name: "Bob",
      username: initialUsers[0].username,
      password: "password123",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    expect(response.body.error).toBe("username must be unique");

    const finalUsers = await helper.usersInDb();
    expect(initialUsers).toHaveLength(finalUsers.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
