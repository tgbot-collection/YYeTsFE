import { combineReducers } from "@reduxjs/toolkit";

import { userReducer } from "app/userSlice";

export const rootReducer = combineReducers({
  user: userReducer,
});
