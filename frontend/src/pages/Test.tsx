import { FunctionComponent, useState, useRef, ChangeEvent } from "react";
import KeyboardWrapper from "../components/KeyboardWrapper";
import { TextField } from "@mui/material";

const Test: FunctionComponent = () => {
  const [input, setInput] = useState("");
  const keyboard = useRef<any>(null);

  const onChangeInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

  return (
    <div>
      <TextField
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={(e) => onChangeInput(e)}
      />
      <KeyboardWrapper keyboardRef={keyboard} onChange={setInput} />
    </div>
  );
};

export default Test;

//make a function that takes text
//convert the text to audio
//have a button that when pressed can hear the audio
