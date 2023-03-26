import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { themeReducer } from "app/themeSlice";
import { userReducer } from "app/pages/login/userSlice";

const initialState = {
  data: null,
};
const adsenseReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  user: persistReducer({ storage, key: "user", version: 1, whitelist: ["username"] }, userReducer),
  theme: persistReducer({ storage, key: "theme", version: 1, whitelist: ["appearance"] }, themeReducer),
  adsenseState: adsenseReducer,
});
