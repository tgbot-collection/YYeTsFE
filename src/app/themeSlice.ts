/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppearanceType = "light" | "dark" | "auto";

interface ThemeState {
  appearance: AppearanceType;
}

const initialState: ThemeState = {
  appearance: "auto",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeAppearance: (state, { payload }: PayloadAction<AppearanceType>) => {
      state.appearance = payload;
    },
  },
});

export const themeReducer = themeSlice.reducer;
