import { configureStore } from "@reduxjs/toolkit";
import UpdateColor from "./slices/updateColor";
import UpdateFont from "./slices/updateText";
const store = configureStore({
  reducer: {
    UpdateColor: UpdateColor,
    UpdateFont: UpdateFont,
  },
});

export default store;