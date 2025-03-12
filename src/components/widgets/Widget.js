import React, { useState } from "react";
import getCity from "../../api/index.js";

function Widget(props) {
  const { index, city, setCities } = props;
  const [buttonText, setButtonText] = useState("See details");

  function removeCity() {
    setCities(prevValue => prevValue.filter((value, i) => i !== index));
  }

  function refreshCity() {
    // Refresh based on the current city's name.
    getCity(city.current.name, setCities, index);
  }

  // Group forecast data to display one entry per day.
  // Since forecast data is in 3-hour intervals (8 entries per day), pick every 8th entry.
  const dailyForecast = city.forecast.list.filter((item, idx) => idx % 8 === 0);

  return (
    <div className="col-sm-6 col-md-4 col-xl-3 px-4">
      <div className="card mb-5">
        <div className="card-body">
          <button className="close-button btn btn-danger rounded-circle p-2 tt" onClick={removeCity}>
            <span className="tttext bg-dark">Close widget</span>
          </button>
          <button className="refresh-button btn btn-warning rounded-circle p-2 tt" onClick={refreshCity}>
            <span className="tttext bg-dark">Refresh widget</span>
          </button>

          <h4 className="card-title">{city.current.name}</h4>
          <h5 className="card-subtitle text-muted lead">
            {city.current.day} {city.current.time}
          </h5>
          <h5 className="card-subtitle text-muted lead">
            {city.current.weather[0].description}
          </h5>
          <img
            src={"http://openweathermap.org/img/wn/" + city.current.weather[0].icon + "@2x.png"}
            alt="weather icon"
            style={{ width: "100px", float: "right" }}
          />
          <div className="pt-3">
            <p className="card-text display-6 mb-3">
              {city.current.main.temp}°C
            </p>
            <div className="collapse" id={"collapseExample" + index} style={{ whiteSpace: "nowrap" }}>
              <p className="card-text">Feels like: {city.current.main.feels_like}°C</p>
              <p className="card-text">Humidity: {city.current.main.humidity}%</p>
              <br />
              <p className="card-text">Pressure: {city.current.main.pressure} hPa</p>
              <p className="card-text">
                Wind: {city.current.wind.speed} km/h - {city.current.wind.deg}°
              </p>
              <hr />
              <h6>5-Day Forecast</h6>
              <div className="row">
                {dailyForecast.map((item, idx) => (
                  <div key={idx} className="col-12">
                    <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <p>Temp: {Math.round(item.main.temp)}°C</p>
                    <p>{item.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="collapsible btn btn-dark mt-3"
            data-bs-toggle="collapse"
            data-bs-target={"#collapseExample" + index}
            aria-expanded="false"
            aria-controls={"collapseExample" + index}
            onClick={() => {
              setButtonText(buttonText === "See details" ? "Hide details" : "See details");
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Widget;
