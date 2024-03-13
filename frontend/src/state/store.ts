import { configureStore } from "@reduxjs/toolkit";
import actionButtonSlice from "./slices/actionButtonSlice";
import messagesSlice from "./slices/messagesSlice";

export const store = configureStore({
  reducer: {
    actionbutton: actionButtonSlice,
    messages: messagesSlice,
  },
});

// export const selectActionButtonState = state => state.actionbuttons
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
