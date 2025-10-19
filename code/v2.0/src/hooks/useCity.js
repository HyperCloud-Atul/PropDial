import { CityContext } from "../context/CityContext";
import { useContext } from "react";

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw Error("useCityContext must be used inside an CityContextProvider");
  }

  return context;
};
