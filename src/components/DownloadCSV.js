import React from "react";

function DownloadCSV({ cities }) {
  // Convert cities data (using the current weather info) to CSV.
  const convertToCSV = (citiesData) => {
    if (citiesData.length === 0) return "";
    
    // Define the header (you can adjust the fields as needed)
    const header = [
      "City",
      "Day",
      "Time",
      "Temperature (°C)",
      "Feels Like (°C)",
      "Humidity (%)",
      "Pressure (hPa)",
      "Wind Speed (km/h)",
      "Wind Direction (°)",
      "Description"
    ];
    
    // Map over each city and extract the current weather details.
    const csvRows = citiesData.map((city) => {
      const current = city.current;
      const row = [
        current.name,
        current.day,
        current.time,
        current.main.temp,
        current.main.feels_like,
        current.main.humidity,
        current.main.pressure,
        current.wind.speed,
        current.wind.deg,
        current.weather[0].description
      ];
      return row.map((value) => `"${value}"`).join(",");
    });
    
    return [header.join(","), ...csvRows].join("\n");
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(cities);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "weather_data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <button onClick={downloadCSV} className="btn btn-primary">
        Download CSV
      </button>
    </div>
  );
}

export default DownloadCSV;
