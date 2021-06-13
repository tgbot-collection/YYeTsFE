import * as React from "react";
import Cookies from "js-cookie";

const isLogin = Cookies.get().hasOwnProperty("username") ? localStorage.getItem("username") || "" : "";

export const UserContext = React.createContext({
  name: isLogin,
  setName: (value: any) => {},
});

interface UserPropTypes {
  children: React.ReactNode;
}

export function UserProvider(props: UserPropTypes) {
  const { children } = props;
  const [name, setName] = React.useState(isLogin);

  return <UserContext.Provider value={{ name, setName }}>{children}</UserContext.Provider>;
}
