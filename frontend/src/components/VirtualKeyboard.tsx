import { Box, TextField } from "@mui/material";
import { useState, ChangeEvent, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setKeyboardActive } from "../state/slices/actionButtonSlice";
import { appendMessage } from "../state/slices/messagesSlice";

type VirtualKeyboardProps = {
  handleEnter?: () => void;
};

const VirtualKeyboard = ({ handleEnter }: VirtualKeyboardProps) => {
  const [layoutName, setLayoutName] = useState("default");
  const dispatch = useAppDispatch();
  const { messages } = useAppSelector((state) => state.messages);

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
    }

    if (button === "{enter}") {
      const newMessageId =
        messages.length > 0 ? messages[messages.length - 1].id + 1 : 0;
      const newMessage = {
        content: input,
        id: newMessageId,
        timestamp: new Date().toISOString(),
        userIsSender: true,
      };
      dispatch(appendMessage(newMessage));
      handleEnter?.();
      dispatch(setKeyboardActive(false));
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
