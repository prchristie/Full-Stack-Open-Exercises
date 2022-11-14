const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e.message));

const isNumeric = (value) => /^\d+$/.test(value);

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    unique: true,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: (val) => {
      if (isNumeric(val)) {
        // if entire thing is a num - valid
        return true;
      } else if (val.includes("-")) {
        // if the value contains a -, check that either side of it is entirely a number and the length of the left side
        // if 2 or 3
        const [left, ...rest] = val.split("-");
        const right = rest.join("-");
        return (
          isNumeric(left) &&
          isNumeric(right) &&
          (left.length === 2 || left.length === 3) &&
          left.length + right.length >= 8
        );
      }

      return false;
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
