import KeyboardIcon from "@mui/icons-material/Keyboard";
import MicIcon from "@mui/icons-material/Mic";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

const styles = {
  activeButton: {
    backgroundColor: "secondary.main",
  },
  container: { display: "flex", gap: 1 },
  inactiveButton: {
    backgroundColor: "primary.light",
  },
};

const ActionButtons = () => {
  const [micActive, setMicActive] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);

  const onMicClick = () => {
    if (micActive) {
      // Process audio
      setMicActive(false);
    } else {
      setMicActive(true);
      setKeyboardActive(false);
      // Record audio
    }
  };

  const onKeyboardClick = () => {
    if (keyboardActive) {
      // Close keyboard
      setKeyboardActive(false);
    } else {
      setMicActive(false);
      setKeyboardActive(true);
      // Display keyboard
    }
  };

  return (
    // TODO: Fix Theming
    <Box sx={styles.container}>
      <IconButton
        onClick={onMicClick}
        sx={micActive ? styles.activeButton : styles.inactiveButton}
      >
        <MicIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={onKeyboardClick}
        sx={keyboardActive ? styles.activeButton : styles.inactiveButton}
      >
        <KeyboardIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default ActionButtons;
