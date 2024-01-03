import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

const Clock = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted ie clean up
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures the effect runs only once on mount ie once when the page loads

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Set to false for 24-hour format
  };

  const formattedDate = currentDateTime.toLocaleString(undefined, dateOptions);
  const formattedTime = currentDateTime.toLocaleString(undefined, timeOptions);

  return (
    <div>
      <Typography>{formattedDate}</Typography>
      <Typography>{formattedTime}</Typography>
    </div>
  );
};

export default Clock;
