import { Box, TextField } from "@mui/material";
import { useState, ChangeEvent, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useAppDispatch } from "../state/hooks";
import { setKeyboardActive } from "../state/slices/actionButtonSlice";
import { appendMessage } from "../state/slices/messagesSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type VirtualKeyboardProps = {
  handleEnter?: () => void;
};

const VirtualKeyboard = ({ handleEnter }: VirtualKeyboardProps) => {
  const [layoutName, setLayoutName] = useState("default");
  const dispatch = useAppDispatch();

  const [input, setInput] = useState("");
  const keyboardRef = useRef<KeyboardReactInterface | null>(null);

  const navigate = useNavigate();

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setInput(event.target.value);
    if (keyboardRef.current) {
      keyboardRef.current.setInput(input);
    }
  };

  const onKeyPress = async (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }

    if (button === "{enter}" && input.trim() !== "") {
      const newMessage = {
        content: input,
        timestamp: new Date().toISOString(),
        userIsSender: true,
      };
      dispatch(appendMessage(newMessage));
      handleEnter?.();
      dispatch(setKeyboardActive(false));
      const formData = new FormData();
      formData.append("textInput", input);
      try {
        const res = await axios.post(
          "http://localhost:8000/api/text/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        dispatch(appendMessage(res.data));
        navigate("/response");
      } catch (error) {
        console.log("API ERROR");
      }
    }

    if (input.trim() === "") {
      setInput("");
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
