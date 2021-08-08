/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserGroup } from "API";

interface UserState {
  username: string;
  group: Array<UserGroup>;
}

const initialState: UserState = {
  username: localStorage.getItem("username") || "",
  group: ["user"],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, { payload: { username, group } }: PayloadAction<UserState>) => {
      state.username = username;
      state.group = group;
    },
  },
});

export const { setUsername } = userSlice.actions;
export const userReducer = userSlice.reducer;
