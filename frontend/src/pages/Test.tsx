import { FunctionComponent, useState, useRef, ChangeEvent } from "react";
import KeyboardWrapper from "../components/KeyboardWrapper";

const Test: FunctionComponent = () => {
  const [input, setInput] = useState("");
  const keyboard = useRef<any>(null);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

  return (
    <div>
      <input
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={e => onChangeInput(e)}
      />
      <KeyboardWrapper keyboardRef={keyboard} onChange={setInput} />
    </div>
  );
};

export default Test;
