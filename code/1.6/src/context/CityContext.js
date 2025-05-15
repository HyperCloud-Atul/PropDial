import { createContext, useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const CityContext = createContext();

export const CityContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [city, setCityItem] = useState(localStorage.getItem("city") || "");
  const [openCityModal, setOpenCityModal] = useState(false);

  const getCityItem = useCallback(() => {
    return localStorage.getItem("city");
  }, []);
  const setCity = useCallback((newCity) => {
    setCityItem(newCity);
    return localStorage.setItem("city", newCity);
  }, []);

  useEffect(() => {
    if (user === null) {
      return;
    }
    if (user?.city && user?.city !== "") {
      setCity(user?.city);
    } else {
      const storedCity = getCityItem();
      if (storedCity) {
        setCity(storedCity);
      } else {
        setOpenCityModal(true);
        setCity("");
        localStorage.removeItem("city");
      }
    }
  }, [user, getCityItem, setCity]);

  return (
    <CityContext.Provider
      value={{ city, setCity, openCityModal, setOpenCityModal }}
    >
      {children}
    </CityContext.Provider>
  );
};
