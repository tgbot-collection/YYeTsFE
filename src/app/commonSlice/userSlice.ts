/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppThunk } from "_redux";
import { postUser, PostUserParams } from "API";
import { useSnackbar } from "notistack";

interface UserState {
  username: string;
}

const initialState: UserState = {
  username: localStorage.getItem("username") || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = userSlice.actions;
export const userReducer = userSlice.reducer;

export const fetchLogin =
  (user: PostUserParams): AppThunk =>
  async (dispatch) => {
    try {
      await postUser(user);
      dispatch(setUsername(user.username));
    } catch (err) {
      const { enqueueSnackbar } = useSnackbar();

      if (err.isAxiosError) {
        enqueueSnackbar(err.response.data, { variant: "error" });
        return;
      }

      enqueueSnackbar(`登录失败：${err.message}`, { variant: "error" });
    }
  };
