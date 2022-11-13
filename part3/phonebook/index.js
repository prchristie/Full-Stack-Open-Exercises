require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

app = express();
app.use(express.json());
app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ")
  )
);
app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById({ _id: id })
    .then((p) => {
      console.log(p);
      response.json(p);
    })
    .catch((e) => next(e));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((res) => response.status(204).end())
    .catch((e) => next(e));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updated) => response.json(updated))
    .catch((e) => next(e));
});
app.post("/api/persons", (request, response) => {
  const body = request.body;

  let errors = [];
  if (!body.name) {
    errors = errors.concat("name missing");
  }

  if (!body.number) {
    errors = errors.concat("number missing");
  }

  if (errors.length > 0) {
    return response.status(404).json({
      errors: errors,
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => response.json(savedPerson));
});

app.get("/info", (request, response) => {
  Person.count()
    .then((num) =>
      response.send(
        `<p>Phonebook has info for ${num} people</p>
    <p>${new Date()}</p>`
      )
    )
    .catch((e) => next(e));
});

const errorHandler = (error, request, response, next) => {
  /* Don't really know what I'm meant to do in the error handler */
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
