import { CountryDetail } from "./CountryDetail";
import { CountryOutline } from "./CountriesList";

export const CountriesView = ({
  countries,
  countryWeather,
  handleShowButtonClick,
}) => {
  if (countries.length > 10) {
    return <>Too many matches, specify another filter</>;
  } else if (countries.length === 1) {
    const country = countries[0];
    return (
      <>
        <CountryDetail country={country} weather={countryWeather} />
        {/* <Weather weather={countryWeather} /> */}
      </>
    );
  }

  return (
    <>
      {countries.map((country) => (
        <CountryOutline
          key={country.name.official}
          country={country}
          handleShowButtonClick={handleShowButtonClick}
        />
      ))}
    </>
  );
};
