import KeyboardIcon from "@mui/icons-material/Keyboard";
import MicIcon from "@mui/icons-material/Mic";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { ChangeEvent, useRef, useState } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import { useDispatch, useSelector } from 'react-redux';

const styles = {
  activeButton: {
    backgroundColor: "secondary.main",
  },
  inactiveButton: {
    backgroundColor: "primary.light",
  },
  root: { display: "flex", gap: 1 },
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

  const [input, setInput] = useState("");
  const keyboard = useRef<any>(null);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.target.value;
    setInput(input);
    keyboard.current!.setInput(input);
  };

  return (
    // TODO: Fix Theming
    <Box sx={styles.root}>
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
      {keyboardActive ? (
        <VirtualKeyboard keyboardRef={keyboard} onChange={setInput} />
      ) : null}
    </Box>
  );
};

export default ActionButtons;
