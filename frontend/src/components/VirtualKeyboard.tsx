import { FunctionComponent, useState, useRef, ChangeEvent } from "react";
import KeyboardWrapper from "../components/KeyboardWrapper";
import { Box, TextField } from "@mui/material";

type VirtualKeyboardProps = { handleEnter: (button: string) => void };

const VirtualKeyboard = ({ handleEnter }: VirtualKeyboardProps) => {
  const [input, setInput] = useState("");
  const keyboard = useRef(null);

  const onChangeInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

  // const [button, setButton] = useState("");

  return (
    <Box>
      {/* <TextField
        fullWidth
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={(e) => onChangeInput(e)}
      /> */}
      <KeyboardWrapper
        keyboardRef={keyboard}
        onChange={setInput}
        handleEnter={handleEnter}
      />
    </Box>
  );
};

export default VirtualKeyboard;
