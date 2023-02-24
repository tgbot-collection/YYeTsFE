/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserGroup } from "API";

interface UserState {
  username: string;
  group: Array<UserGroup>;
  avatar: string;
}

const initialState: UserState = {
  username: localStorage.getItem("username") || "",
  group: ["user"],
  avatar: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, { payload: { username, group, avatar } }: PayloadAction<UserState>) => {
      state.username = username;
      state.group = group;
      state.avatar = avatar;
    },
  },
});

export const { setUsername } = userSlice.actions;
export const userReducer = userSlice.reducer;
