import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type actionButtonState = {
  keyboardState: boolean;
  micState: boolean;
};

const initialState: actionButtonState = {
  keyboardState: false,
  micState: false,
};

export const actionButtonSlice = createSlice({
  name: "actionbuttons",
  initialState,
  reducers: {
    setKeyboardActive: (state, action: PayloadAction<boolean>) => {
      state.keyboardState = action.payload;
    },
    setMicActive: (state, action: PayloadAction<boolean>) => {
      state.micState = action.payload;
    },
  },
});

export const { setKeyboardActive, setMicActive } = actionButtonSlice.actions;
export default actionButtonSlice.reducer;
