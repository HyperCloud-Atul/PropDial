// utils/formatCountry.js

const formatCountry = (countryName) => {
  if (!countryName) return "";

  const map = {
    "United States": "USA",
    "United States of America": "USA",
    "United Kingdom": "UK",
    "United Kingdom of Great Britain and Northern Ireland": "UK",
    "United Arab Emirates": "UAE",
    // Add more as needed
  };

  return map[countryName.trim()] || countryName;
};

export default formatCountry;
