import * as React from "react";
import { useAppSelector } from "./useRedux";

export const useAuth = () => {
  const { username } = useAppSelector((state) => state.user);

  return React.useMemo(() => ({ username }), [username]);
};
