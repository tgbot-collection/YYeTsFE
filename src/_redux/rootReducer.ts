import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userReducer, themeReducer } from "app/commonSlice";

export const rootReducer = combineReducers({
  user: persistReducer({ storage, key: "user", version: 1, whitelist: ["username"] }, userReducer),
  theme: persistReducer({ storage, key: "theme", version: 1, whitelist: ["appearance"] }, themeReducer),
});
