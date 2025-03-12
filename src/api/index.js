import { toast } from "react-toastify";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const proxy = "https://corsproxy.io/?";
async function getCity(input, setCities, index) {
  try {
    let lat, lon, displayName;
    const query = input.trim();

    // If input is all digits, assume postal code.
    if (/^\d+$/.test(query)) {
      // For 6-digit codes, assume India ("IN"); otherwise default to US.
      let country = query.length === 6 ? "IN" : "US";
      const zipUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${query},${country}&appid=${API_KEY}`;
      const zipResponse = await axios.get(zipUrl);
      lat = zipResponse.data.lat;
      lon = zipResponse.data.lon;
      displayName = zipResponse.data.name;
    } else {
      // Otherwise, treat as a city name or location string.
      const directUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
      const directResponse = await axios.get(directUrl);
      const results = directResponse.data;
      if (!results || results.length === 0) {
        toast.error("Oh-oh, this city does not exist!");
        return;
      }
      // Look for an exact match (case-insensitive) first...
      let bestMatch = results.find(result => result.name.toLowerCase() === query.toLowerCase());
      // ...or one that contains the query.
      if (!bestMatch) {
        bestMatch = results.find(result => result.name.toLowerCase().includes(query.toLowerCase()));
      }
      // Fallback to the first result.
      if (!bestMatch) {
        bestMatch = results[0];
      }
      lat = bestMatch.lat;
      lon = bestMatch.lon;
      displayName = bestMatch.name;
    }

    // Fetch current weather data…
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    // …and the 5-day forecast data.
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    // Run both requests concurrently.
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(currentUrl),
      axios.get(forecastUrl)
    ]);

    const currentData = currentResponse.data;
    const forecastData = forecastResponse.data;

    // Process current weather: round temperature and add local time details.
    if (currentData.main && currentData.main.temp !== undefined) {
      currentData.main.temp = Math.round(currentData.main.temp);
    }
    const today = new Date();
    const hour = () => {
      const hr = today.getUTCHours() + currentData.timezone / 3600;
      return hr < 10 ? "0" + hr : hr;
    };
    const minutes = () => {
      return today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    };
    currentData.time = `${hour()}:${minutes()}`;
    currentData.day = today.toLocaleDateString("en-US", { weekday: "long" });
    currentData.name = displayName;

    // Combine current weather and forecast data into one object.
    const combinedData = {
      current: currentData,
      forecast: forecastData
    };

    // Update the cities state: add a new city if no index provided; otherwise update existing.
    if (index === undefined) {
      setCities(prevCities => [...prevCities, combinedData]);
    } else {
      setCities(prevCities => prevCities.map((cityData, i) => (i === index ? combinedData : cityData)));
      toast.info(`${currentData.name} was updated!`, { autoClose: 1000 });
    }
  } catch (error) {
    toast.error("Oh-oh, this city does not exist!");
  }
}

export default getCity;
