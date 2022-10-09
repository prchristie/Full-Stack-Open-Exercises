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
const Weather = ({ weather }) => {
  if (weather === null) {
    return <></>;
  }

  return (
    <>
      <h2>Weather in {weather.name}</h2>
      <div>temperature {weather.main.temp} Celcius</div>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
        alt={weather.weather[0].description}
      />
      <div>wind {weather.wind.speed} m/s</div>
    </>
  );
};
