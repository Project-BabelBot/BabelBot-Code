import { createSlice } from "@reduxjs/toolkit";

type snackbarState = {
  snackbarOpen: boolean;
};

const initialState: snackbarState = {
  snackbarOpen: false,
};

export const toastSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    closeSnackbar: (state) => {
      state.snackbarOpen = false;
    },
    openSnackbar: (state) => {
      state.snackbarOpen = true;
    },
  },
});

export const { closeSnackbar, openSnackbar } = toastSlice.actions;
export default toastSlice.reducer;
