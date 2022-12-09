const User = require("../models/user");
const bcrypt = require("bcrypt");

const hashPassword = (pw) => bcrypt.hashSync(pw, 10);
const initialUsers = [
  {
    username: "BobSmith123",
    name: "Bob Smith",
    password: hashPassword("password123"),
  },
  {
    username: "HarryQwan",
    name: "Nick",
    password: hashPassword(
      "Lj%Uq7UtJDAR4JxvJQAFcLUJuPRu&ZJndfs6A275%yC89HKBErwTbsM*xBY6eQW8"
    ),
  },
];

const usersInDb = async () => {
  const users = await User.find({});

  return users.map((user) => user.toJSON());
};

const createUser = async (username, name, pw) => {
  const hashedPw = await hashPassword(pw);
  const user = User({
    username,
    name,
    hashedPw,
  });

  return user;
};

module.exports = {
  usersInDb,
  createUser,
  hashPassword,
  initialUsers,
};
