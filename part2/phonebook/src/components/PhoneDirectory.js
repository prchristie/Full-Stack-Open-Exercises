import { Contact } from "./Contact";

export const PhoneDirectory = ({ persons }) => (
  <>
    <h2>Numbers</h2>
    {persons.map((person) => (
      <Contact key={person.name} person={person} />
    ))}
  </>
);
