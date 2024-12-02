import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { bold: false },
  { italic: false },
  { underline: false },
  { fontStyle: "Auto" },
  { fontSize: "18" },
];

const UpdateFont = createSlice({
  name: "updatefont",
  initialState: initialState,
  reducers: {
    changeFont: (state, action) => {
      const { key, value } = action.payload;
      const index = state.findIndex((item) => item.hasOwnProperty(key));
      if (index !== -1) {
        state[index][key] = value;
      }
    },
    setDefaultText: (state) => {
      return initialState.map((item) => ({ ...item }));
    },
  },
});

export const { changeFont, setDefaultText } = UpdateFont.actions;
export default UpdateFont.reducer;