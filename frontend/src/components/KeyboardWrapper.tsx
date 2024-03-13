import { Box, TextField } from "@mui/material";
import {
  FunctionComponent,
  useState,
  MutableRefObject,
  ChangeEvent,
  useRef,
} from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useAppSelector } from "../state/hooks";

interface IProps {
  handleEnter: () => void;
  // setMessages?: (newMessage: Message) => void;
  // onChange: (input: string) => void;
  // keyboardRef: MutableRefObject<typeof Keyboard>;
}

const KeyboardWrapper: FunctionComponent<IProps> = ({
  // onChange,
  // keyboardRef,
  handleEnter,
  // setMessages,
}) => {
  const [layoutName, setLayoutName] = useState("default");
  const { messagesArray } = useAppSelector((state) => state.messages);

  const [input, setInput] = useState("");
  const keyboard = useRef(null);

  const onChangeInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    } else if (button === "{enter}") {
      handleEnter();
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={(e) => onChangeInput(e)}
      />
      <Keyboard
        // keyboardRef={(r) => (keyboardRef.current = r)}
        keyboardRef={(r) => (keyboard.current = r)}
        layoutName={layoutName}
        onChange={setInput}
        onKeyPress={onKeyPress}
      />
    </Box>
  );
};

export default KeyboardWrapper;
