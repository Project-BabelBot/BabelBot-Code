import { TextField } from "@mui/material";
import React, { useState, ChangeEvent, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useAppDispatch } from "../state/hooks";
import { setKeyboardActive } from "../state/slices/actionButtonSlice";
import { appendMessage } from "../state/slices/messagesSlice";
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "./Box";

type VirtualKeyboardProps = {
  onEnter?: () => void;
};

const VirtualKeyboard = ({ onEnter }: VirtualKeyboardProps) => {
  const [layoutName, setLayoutName] = useState("default");
  const dispatch = useAppDispatch();

  const [input, setInput] = useState("");
  const keyboardRef = useRef<KeyboardReactInterface | null>(null);

  const navigate = useNavigate();

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setInput(event.target.value);
    keyboardRef.current?.setInput(event.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }

    if (button === "{enter}" && input.trim() !== "") {
      onSubmit();
    }

    if (input.trim() === "") {
      setInput("");
    }
  };

  const onSubmit = async () => {
    const newMessage = {
      content: input,
      language: "en",
      timestamp: new Date().toISOString(),
      userIsSender: true,
    };
    dispatch(appendMessage(newMessage));
    onEnter?.();
    dispatch(setKeyboardActive(false));
    const formData = new FormData();
    formData.append("textInput", input);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/text-nlp/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(appendMessage(res.data));
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response) {
          dispatch(appendMessage(error.response.data));
        } else {
          const errorMessage = {
            content:
              "Sorry, looks like there's a network error. Please try again later",
            error: true,
            language: "en",
            timestamp: new Date().toISOString(),
            userIsSender: false,
          };
          dispatch(appendMessage(errorMessage));
        }
      }
    }

    navigate("/response");
  };

  return (
    <Box>
      <TextField
        autoFocus
        fullWidth
        onChange={(e) => onChange(e)}
        onKeyDown={onKeyDown}
        placeholder="Type on the keyboard to start"
        value={input}
      />
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        onChange={setInput}
        onKeyPress={onKeyPress}
        preventMouseDownDefault
      />
    </Box>
  );
};

export default VirtualKeyboard;
