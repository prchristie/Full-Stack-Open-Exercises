export const Weather = ({ weather }) => {
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
