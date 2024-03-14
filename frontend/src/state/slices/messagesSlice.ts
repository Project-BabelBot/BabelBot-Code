import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Message = {
  attachment?: string;
  content: string;
  id: number;
  timestamp: string;
  userIsSender: boolean;
};

type messagesState = {
  messages: Message[];
};

const initialState: messagesState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    appendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push({ ...action.payload });
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { appendMessage, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
