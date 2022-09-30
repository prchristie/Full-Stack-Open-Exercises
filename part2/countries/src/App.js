import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [countryFilter, setCountryFilter] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data));
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toUpperCase().includes(countryFilter.toUpperCase())
  );

  return (
    <div>
      <Filter
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
      />
      <CountriesInfo countries={filteredCountries} />
    </div>
  );
}

const CountriesInfo = ({ countries }) => {
  if (countries.length > 10) {
    return <>Too many matches, specify another filter</>;
  } else if (countries.length === 1) {
    const country = countries[0];
    return <CountryDetail country={country} />;
  }

  return <CountryList countries={countries} />;
};

const CountryList = ({ countries }) => {
  return (
    <>
      {countries.map((country) => (
        <div key={country.name.common}>{country.name.common}</div>
      ))}
    </>
  );
};

const CountryDetail = ({ country }) => {
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
    </>
  );
};
export default App;
const Filter = ({ countryFilter, setCountryFilter }) => (
  <form>
    find countries
    <input
      value={countryFilter}
      onChange={(e) => setCountryFilter(e.target.value)}
    />
  </form>
);
