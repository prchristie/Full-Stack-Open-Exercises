import { useEffect, useState } from "react";
import { NewContactForm as NewPersonForm } from "./components/NewContactForm";
import { PhoneDirectory } from "./components/PhoneDirectory";
import personService from "./services/persons";
import { NameFilterForm } from "./components/NameFilterForm";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const findPersonOfName = (name) =>
    persons.find((person) => person.name === name);

  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

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
          });
      }
    }

    personService.create(newPerson).then((p) => {
      setPersons(persons.concat(p));
      setNewNumber("");
      setNewName("");
    });
  };

  const deletePersonFromPhoneBook = (deletedPerson) => {
    const deleteConfirmation = window.confirm(`Delete ${deletedPerson.name}`);

    if (deleteConfirmation) {
      personService.deletePhoneBookEntry(deletedPerson.id);

      setPersons(persons.filter((person) => person.id !== deletedPerson.id));
    }
  };

  const filterPersonsByName = (name) =>
    persons.filter((person) =>
      person.name.toLowerCase().includes(name.toLowerCase())
    );

  return (
    <div>
      <h2>Phonebook</h2>
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
