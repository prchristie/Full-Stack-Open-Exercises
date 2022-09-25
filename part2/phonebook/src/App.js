import { useState } from "react";
import { NewContactForm as NewPersonForm } from "./components/NewContactForm";
import { PhoneDirectory } from "./PhoneDirectory";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const doesPhoneBookContainName = (name) =>
    persons.findIndex((person) => person.name === name) !== -1;

  const addPerson = (event) => {
    event.preventDefault();
    if (doesPhoneBookContainName(newName)) {
      alert(`${newName} is already added to the phonebook`);
      return;
    }
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewNumber("");
    setNewName("");
  };

  const filterPersonsByName = (name) =>
    persons.filter((person) => person.name.toLowerCase().includes(nameFilter));

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
        handleSubmit={addPerson}
        handleNameChange={handleNameChange}
        nameValue={newName}
        handleNumberChange={handleNumberChange}
        numberValue={newNumber}
      />
      <PhoneDirectory persons={filterPersonsByName(nameFilter)} />
    </div>
  );
};

const NameFilterForm = ({ handleFilterChange, nameFilterValue }) => (
  <div>
    filter shown with
    <input type="text" onChange={handleFilterChange} value={nameFilterValue} />
  </div>
);

export default App;
