import axios from "axios";
import { useEffect, useState } from "react";
import { CountriesView } from "./components/Content";
import { CountryFilter } from "./components/Filter";

const api_key = process.env.REACT_APP_API_KEY;

function App() {
  const [countryFilter, setCountryFilter] = useState("");
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setFilteredCountries(response.data);
      return setCountries(response.data);
    });
  }, []);

  const filterCountriesByName = (name) =>
    countries.filter((country) =>
      country.name.common.toUpperCase().includes(name.toUpperCase())
    );

  useEffect(() => {
    if (
      filteredCountries.length === 1 &&
      filteredCountries[0].hasOwnProperty("capital")
    ) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${filteredCountries[0].capital[0]}&APPID=${api_key}&units=metric`
        )
        .then((response) => setWeather(response.data));
    }
  }, [filteredCountries]);

  const handleShowButtonClick = (country) =>
    handleFilterChange(country.name.common);

  const handleFilterChange = (value) => {
    setCountryFilter(value);
    setFilteredCountries(filterCountriesByName(value));
  };

  return (
    <div>
      <CountryFilter
        currentFilter={countryFilter}
        handleFilterChange={handleFilterChange}
      />
      <CountriesView
        countries={filteredCountries}
        countryWeather={weather}
        handleShowButtonClick={handleShowButtonClick}
      />
    </div>
  );
}

export default App;
