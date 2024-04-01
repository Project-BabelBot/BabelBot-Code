import { configureStore } from "@reduxjs/toolkit";
import actionButtonSlice from "./slices/actionButtonSlice";
import messagesSlice from "./slices/messagesSlice";
import snackbarSlice from "./slices/snackbarSlice";

export const store = configureStore({
  reducer: {
    actionButtons: actionButtonSlice,
    messages: messagesSlice,
    snackbar: snackbarSlice,
  },
});

// export const selectActionButtonState = state => state.actionbuttons
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
