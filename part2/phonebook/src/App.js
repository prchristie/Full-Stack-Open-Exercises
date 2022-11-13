import { useEffect, useState } from "react";
import { NewContactForm as NewPersonForm } from "./components/NewContactForm";
import { PhoneDirectory } from "./components/PhoneDirectory";
import personService from "./services/persons";
import { NameFilterForm } from "./components/NameFilterForm";
import { Notification } from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const findPersonOfName = (name) =>
    persons.find((person) => person.name === name);

  useEffect(() => {
    personService
      .getAll()
      .then((persons) => {
        setPersons(persons);
      })
      .catch((err) => {
        notifyOfError(err.message);
      });
  }, []);

  const notify = (msg, isError) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } else {
      setNotification(msg);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const notifyOfError = (msg) => notify(msg, true);
  const notifyOfSuccess = (msg) => notify(msg, false);

  const handleAddPersonEvent = (event) => {
    event.preventDefault();

    const newPerson = { name: newName, number: newNumber };

    const personWithSameName = findPersonOfName(newPerson.name);

    if (personWithSameName !== undefined) {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(personWithSameName.id, newPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== personWithSameName.id ? p : updatedPerson
              )
            );
            setNewNumber("");
            setNewName("");
            notifyOfSuccess(`Updated ${newPerson.name}`);
          })
          .catch((err) => {
            if (err.response.status === 404) {
              notifyOfError(
                `Information of ${newPerson.name} has already been removed from server`
              );
              setPersons(
                persons.filter((person) => person.id !== personWithSameName.id)
              );
            } else if (err.response.status === 400) {
              notifyOfError(err.response.data.error);
            } else {
              notifyOfError(err.message);
            }
          });
      }
    } else {
      personService
        .create(newPerson)
        .then((p) => {
          setPersons(persons.concat(p));
          setNewNumber("");
          setNewName("");
          notifyOfSuccess(`Added ${newPerson.name}`);
        })
        .catch((err) => {
          notifyOfError(err.response.data.error);
        });
    }
  };

  const deletePersonFromPhoneBook = (deletedPerson) => {
    const deleteConfirmation = window.confirm(`Delete ${deletedPerson.name}?`);

    if (deleteConfirmation) {
      personService
        .deletePhoneBookEntry(deletedPerson.id)
        .then((res) =>
          setPersons(persons.filter((person) => person.id !== deletedPerson.id))
        )
        .catch((err) => {
          notifyOfError(err.message);
        });
    }
  };

  const filterPersonsByName = (name) =>
    persons.filter((person) => {
      return person.name.toLowerCase().includes(name.toLowerCase());
    });

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={false} />
      <Notification message={error} isError={true} />
      <NameFilterForm
        handleFilterChange={(e) => setNameFilter(e.target.value)}
        nameFilterValue={nameFilter}
      />
      {/* Need a better way of dealing with forms. Whats the best practice? Imagine a form with 5
      or more inputs. This doenst scale well*/}
      <h3>Add a new</h3>
      <NewPersonForm
        handleSubmit={handleAddPersonEvent}
        handleNameChange={handleNameChange}
        nameValue={newName}
        handleNumberChange={handleNumberChange}
        numberValue={newNumber}
      />
      <PhoneDirectory
        persons={filterPersonsByName(nameFilter)}
        deletePersonCallback={deletePersonFromPhoneBook}
      />
    </div>
  );
};

export default App;
