import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { Box } from "./Box";

const styles = {
  root: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
};

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
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = currentDateTime.toLocaleString(undefined, dateOptions);
  const formattedTime = currentDateTime.toLocaleString(undefined, timeOptions);

  return (
    <Box sx={styles.root}>
      <Box>
        <Typography variant="subtitle2">{formattedTime}</Typography>
        <Typography variant="subtitle2">{formattedDate}</Typography>
      </Box>
    </Box>
  );
};

export default Clock;
