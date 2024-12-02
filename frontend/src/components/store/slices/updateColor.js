

import { createSlice } from "@reduxjs/toolkit";


const initialState = [
  { id: "cb1", color_up: "#282c34" },
  { id: "cb2", color_up: "black" }, // title heading
  { id: "cb3", color_up: "#d3f4d4" }, // bot background
  { id: "cb4", color_up: "black" }, // bot text
  { id: "cb5", color_up: "#d2cff2" }, // user back
  { id: "cb6", color_up: "black" }, // user text
];

const UpdateColor = createSlice({
  name: "updatecolor",
  initialState: initialState,
  reducers: {
    changeColor: (state, action) => {
      const { id, color_up } = action.payload;
      const item = state.find((item) => item.id === id);
      if (item) {
        item.color_up = color_up; 
      }
    },
    setDefault: (state) => {
      return initialState.map((item) => ({ ...item })); 
    },
  },
});

export const { changeColor, setDefault } = UpdateColor.actions;
export default UpdateColor.reducer;