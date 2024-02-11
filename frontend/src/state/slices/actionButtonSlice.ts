import { createSlice } from "@reduxjs/toolkit";

type actionButtonState = {
  keyboardState: boolean;
  micState: boolean;
};

const initialState: actionButtonState = {
  keyboardState:false,
    micState:false
};

export const actionButtonSlice = createSlice({
  name: "actionbuttons",
  initialState,
  reducers:{
    setKeyboardActive: (state) => {
      state.keyboardState = true;
      state.micState = false;
    },
    setMicActive: (state) => {
      state.micState = true;
      state.keyboardState = false;
    },
  },
});

export const {
  setKeyboardActive,
  setMicActive,
} = actionButtonSlice.actions;

export default actionButtonSlice.reducer;