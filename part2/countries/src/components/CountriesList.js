export const CountryOutline = ({ country, handleShowButtonClick }) => (
  <div>
    <span key={country.name.common}>{country.name.common}</span>
    <button onClick={() => handleShowButtonClick(country)}>show</button>
  </div>
);
