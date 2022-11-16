const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://mongo-user:${password}@cluster0.h1akyug.mongodb.net/phonebook?retryWrites=true&w=majority`;
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const displayAllEntries = () => {
  console.log("phonebook:");
  return Person.find({})
    .then((persons) => {
      persons.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      );
    })
    .catch((e) => console.log(e));
};

const addNewPerson = (name, number) => {
  const person = new Person({
    name,
    number,
  });

  return person
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
    })
    .catch((e) => console.log(e));
};

mongoose
  .connect(url)
  .then(() => {
    if (process.argv.length > 4) {
      const name = process.argv[3];
      const number = process.argv[4];
      return addNewPerson(name, number);
    } else if (process.argv.length === 3) {
      return displayAllEntries();
    }
  })
  .finally(() => {
    return mongoose.connection.close();
  });
