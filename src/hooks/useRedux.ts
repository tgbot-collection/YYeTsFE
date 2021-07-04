import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { store } from "_redux";

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
