const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then((res) => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e.message));

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

module.exports = mongoose.model("Person", personSchema);
