import * as React from "react";
import Cookies from "js-cookie";

// eslint-disable-next-line no-prototype-builtins
const isLogin = Cookies.get().hasOwnProperty("username") ? localStorage.getItem("username") || "" : "";

export const UserContext = React.createContext({
  name: isLogin,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setName: (value: string) => {},
});

interface UserPropTypes {
  children: React.ReactNode;
}

export function UserProvider(props: UserPropTypes) {
  const { children } = props;
  const [name, setName] = React.useState(isLogin);

  return <UserContext.Provider value={{ name, setName }}>{children}</UserContext.Provider>;
}
