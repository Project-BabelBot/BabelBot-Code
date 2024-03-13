import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Message = {
  attachment?: string;
  content: string;
  id: number;
  timestamp: string;
  userIsSender: boolean;
};

type messagesState = {
  messagesArray: Message[];
};

const initialState: messagesState = {
  messagesArray: [],
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message>) => {
      state.messagesArray.push({ ...action.payload });
    },
  },
});

export const { setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
