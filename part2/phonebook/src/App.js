import { useState } from "react";
import { NewContactForm } from "./components/NewContactForm";
import { PhoneDirectory } from "./PhoneDirectory";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

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

  return (
    <div>
      <h2>Phonebook</h2>
      {/* Need a better way of dealing with forms. Whats the best practice? */}
      <NewContactForm
        handleSubmit={addPerson}
        handleNameChange={handleNameChange}
        newName={newName}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />
      <PhoneDirectory persons={persons} />
    </div>
  );
};

export default App;
