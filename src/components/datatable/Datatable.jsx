import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { districtData } from "./data";
import Autosuggest from "react-autosuggest";

const MapComponent = ({ location }) => (
  <div className="map-container">
    <iframe
      src={`https://maps.google.com/maps?q=${location}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
      width="100%"
      height="300"
      title="Google Maps"
      allowFullScreen
    ></iframe>
  </div>
);

const Datatable = () => {
  const [location, setLocation] = useState("");
  const [districtInfo, setDistrictInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleLocationChange = (event, { newValue }) => {
    setLocation(newValue);
  };

  const handleLocationSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleLocationSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleLocationSuggestionSelected = (event, { suggestionValue }) => {
    setLocation(suggestionValue);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : districtData.filter(
          (district) =>
            district.district.toLowerCase().slice(0, inputLength) ===
            inputValue
        );
  };

  const renderLocationSuggestion = (suggestion) => <span>{suggestion.district}</span>;

  const getLocationSuggestionValue = (suggestion) => suggestion.district;

  const handleEnterClick = () => {
    const district = districtData.find(
      (item) => item.district.toLowerCase() === location.toLowerCase()
    );

    setDistrictInfo(district);
  };

  return (
    <div className="datatable">
      <MapComponent location={location} />
      <div className="location-input">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={handleLocationSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleLocationSuggestionsClearRequested}
          onSuggestionSelected={handleLocationSuggestionSelected}
          getSuggestionValue={getLocationSuggestionValue}
          renderSuggestion={renderLocationSuggestion}
          inputProps={{
            placeholder: "Enter location",
            value: location,
            onChange: handleLocationChange,
            className: "location-textbox",
          }}
        />
        <button onClick={handleEnterClick} className="search-button">
          Search
        </button>
      </div>
      {districtInfo && (
        <div className="district-info">
          <h2>{districtInfo.district}</h2>
          <p>Waste Amount: {districtInfo.wasteAmount}</p>
          <p>Severity: {districtInfo.severity}</p>
          <p>{districtInfo.description}</p>
        </div>
      )}
    </div>
  );
};

export default Datatable;
