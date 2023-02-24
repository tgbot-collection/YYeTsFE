import * as React from "react";
import { useAppSelector } from "./useRedux";

export const useAuth = () => {
  const { username, avatar } = useAppSelector((state) => state.user);

  return React.useMemo(() => ({ username, avatar }), [username, avatar]);
};
