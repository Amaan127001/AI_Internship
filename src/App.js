import React, { useEffect, useState } from "react";
import Heading from "./components/Heading.js";
import Widgets from "./components/widgets/Widgets.js";
import Form from "./components/Form.js";
import DownloadCSV from "./components/DownloadCSV.js";  // <-- new import
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities) {
      setCities(storedCities);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  return (
    <div>
      <ToastContainer transition={Slide} />
      {cities.length === 0 && <Heading />}
      <Widgets cities={cities} setCities={setCities} />
      <Form setCities={setCities} />
      {/* Download CSV button below the form */}
      {cities.length > 0 && <DownloadCSV cities={cities} />}
    </div>
  );
}

export default App;
