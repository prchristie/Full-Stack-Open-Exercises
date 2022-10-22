import { Contact } from "./Contact";

export const PhoneDirectory = ({ persons, deletePersonCallback }) => (
  <>
    <h2>Numbers</h2>
    {persons.map((person) => (
      <div key={person.id}>
        <Contact person={person} />
        <button onClick={() => deletePersonCallback(person)}>delete</button>
      </div>
    ))}
  </>
);
