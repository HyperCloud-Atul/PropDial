import React from 'react'
import { useState, useEffect } from 'react';

const CurrentDateTime = () => {
      // current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Extract date components separately
  const optionsDate = { month: "short", day: "2-digit", year: "numeric" };
  const formattedDate = currentDateTime.toLocaleDateString(
    "en-US",
    optionsDate
  );
  const weekday = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Format time like "09:25 AM"
  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // second:"2-digit",
    hour12: true,
  });
  return (
    <div className="date_time">
    <h3>{formattedTime}</h3>
    <h6>
      {formattedDate} - {weekday}
    </h6>
  </div>
  )
}

export default CurrentDateTime
