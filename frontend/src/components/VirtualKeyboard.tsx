import { Box, TextField } from "@mui/material";
import { useState, ChangeEvent, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useAppDispatch } from "../state/hooks";

type VirtualKeyboardProps = {
  handleEnter?: () => void;
};

const VirtualKeyboard = ({ handleEnter }: VirtualKeyboardProps) => {
  const [layoutName, setLayoutName] = useState("default");
  const dispatch = useAppDispatch();

  const [input, setInput] = useState("");
  const keyboardRef = useRef<KeyboardReactInterface | null>(null);

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setInput(event.target.value);
    if (keyboardRef.current) {
      keyboardRef.current.setInput(input);
    }
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    } else if (button === "{enter}") {
      handleEnter?.();
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={input}
        placeholder={"Type on the keyboard to start"}
        onChange={(e) => onChange(e)}
      />
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        onChange={setInput}
        onKeyPress={onKeyPress}
      />
    </Box>
  );
};

export default VirtualKeyboard;
