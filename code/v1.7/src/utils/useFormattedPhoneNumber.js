// useFormattedPhoneNumber.js
import { useMemo } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function useFormattedPhoneNumber(number, countryCode) {
  return useMemo(() => {
    if (!number || !countryCode) return "";

    try {
      const phoneNumber = parsePhoneNumberFromString(number, countryCode.toUpperCase());
      return phoneNumber ? phoneNumber.formatInternational() : number;
    } catch (error) {
      console.warn("Invalid phone number:", number);
      return number;
    }
  }, [number, countryCode]);
}
