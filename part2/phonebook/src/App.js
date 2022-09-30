import { useEffect, useState } from "react";
import { NewContactForm as NewPersonForm } from "./components/NewContactForm";
import { PhoneDirectory } from "./components/PhoneDirectory";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const doesPhoneBookContainName = (name) =>
    persons.findIndex((person) => person.name === name) !== -1;

  const addPerson = (person) => {
    if (doesPhoneBookContainName(person.name)) {
      alert(`${newName} is already added to the phonebook`);
      return false;
    }

    setPersons(persons.concat(person));
    return true;
  };

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleNewPersonEvent = (event) => {
    event.preventDefault();
    if (addPerson({ name: newName, number: newNumber })) return;
    setNewNumber("");
    setNewName("");
  };

  const filterPersonsByName = () =>
    persons.filter((person) =>
      person.name.toLowerCase().includes(nameFilter.toLowerCase())
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
        handleSubmit={handleNewPersonEvent}
        handleNameChange={handleNameChange}
        nameValue={newName}
        handleNumberChange={handleNumberChange}
        numberValue={newNumber}
      />
      <PhoneDirectory persons={filterPersonsByName()} />
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
