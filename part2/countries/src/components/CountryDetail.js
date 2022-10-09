import { Weather } from "./Weather";

export const CountryDetail = ({ country, weather }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h4>languages:</h4>
      <ul>
        {Object.entries(country.languages).map(([short, language]) => (
          <li key={short}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common} flag`} />
      <Weather weather={weather} />
    </>
  );
};
