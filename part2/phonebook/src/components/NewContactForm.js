export const NewContactForm = ({
  handleSubmit,
  handleNameChange,
  nameValue,
  handleNumberChange,
  numberValue,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input type="text" onChange={handleNameChange} value={nameValue} />
    </div>
    <div>
      number:
      <input type="text" onChange={handleNumberChange} value={numberValue} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);
