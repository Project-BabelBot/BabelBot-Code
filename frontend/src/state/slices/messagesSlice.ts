import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Message = {
  attachment?: string;
  content: string;
  error?: boolean;
  id: number;
  language: string;
  timestamp: string;
  userIsSender: boolean;
};

type messagesState = {
  messages: Message[];
  loading: boolean;
};

const initialState: messagesState = {
  messages: [],
  loading: false,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    appendMessage: (state, action: PayloadAction<Omit<Message, "id">>) => {
      const newMessageId =
        state.messages.length > 0
          ? state.messages[state.messages.length - 1].id + 1
          : 0;
      const newMessage = { id: newMessageId, ...action.payload };
      state.messages.push(newMessage);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { appendMessage, setLoading } = messagesSlice.actions;
export default messagesSlice.reducer;
