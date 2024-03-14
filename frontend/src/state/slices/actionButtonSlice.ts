import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type actionButtonState = {
  keyboardActive: boolean;
  micActive: boolean;
};

const initialState: actionButtonState = {
  keyboardActive: false,
  micActive: false,
};

export const actionButtonSlice = createSlice({
  name: "actionbuttons",
  initialState,
  reducers: {
    setKeyboardActive: (state, action: PayloadAction<boolean>) => {
      state.keyboardActive = action.payload;
    },
    setMicActive: (state, action: PayloadAction<boolean>) => {
      state.micActive = action.payload;
    },
  },
});

export const { setKeyboardActive, setMicActive } = actionButtonSlice.actions;
export default actionButtonSlice.reducer;
