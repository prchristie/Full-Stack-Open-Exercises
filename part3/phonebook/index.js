require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.json());
app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length") || "0",
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ")
  )
);
app.use(express.static("build"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById({ _id: id })
    .then((p) => {
      if (p) {
        response.json(p);
      } else {
        response.status(404).end();
      }
    })
    .catch((e) => next(e));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((e) => next(e));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updated) => {
      if (updated === null) {
        response.status(404).end();
      } else {
        response.json(updated);
      }
    })
    .catch((e) => next(e));
});
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((e) => {
      if (e.name === "MongoServerError") {
        return response.status(400).json({ error: "Name is not unique" });
      }
      next(e);
    });
});

app.get("/info", (request, response, next) => {
  Person.count()
    .then((num) =>
      response.send(
        `<p>Phonebook has info for ${num} ${num === 1 ? "person" : "people"}</p>
    <p>${new Date()}</p>`
      )
    )
    .catch((e) => next(e));
});

const errorHandler = (error, request, response, next) => {
  /* Don't really know what I'm meant to do in the error handler */
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
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
