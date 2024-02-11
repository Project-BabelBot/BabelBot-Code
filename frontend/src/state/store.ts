import { configureStore } from "@reduxjs/toolkit";
import actionButtonSlice from "./slices/actionButtonSlice";

export const store = configureStore({
    reducer: {
      actionbutton: actionButtonSlice,
    },
  });

  export const selectActionButtonState = state => state.actionbuttons


