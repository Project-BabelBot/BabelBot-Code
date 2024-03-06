// import { useState, useRef, ChangeEvent } from 'react';
// import VirtualKeyboard from '../components/VirtualKeyboard'

// const Test = () => {
//     const [input, setInput] = useState("");
//     const keyboard = useRef<any>(null);

//     const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
//         const input = event.target.value;
//         setInput(input);
//         keyboard.current!.setInput(input);
//       };
//   return (
//     <div>
//         <VirtualKeyboard onChange={setInput}/>
//         </div>
//   )
// }
// export default Test

import React, { FunctionComponent, useState, useRef, ChangeEvent } from "react";
import KeyboardWrapper from "../components/KeyboardWrapper";

const Test: FunctionComponent = () => {
  const [input, setInput] = useState("");
  const keyboard = useRef(null);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
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
