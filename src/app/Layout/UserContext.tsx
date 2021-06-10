import * as React from "react";
import Cookies from "js-cookie";

export const UserContext = React.createContext({ name: "", setName: (value: any) => {} });

interface UserPropTypes {
  children: React.ReactNode;
}

export function UserProvider(props: UserPropTypes) {
  const { children } = props;
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (Cookies.get().hasOwnProperty("username")) setName(localStorage.getItem("username") || "");
  }, []);

  return <UserContext.Provider value={{ name, setName }}>{children}</UserContext.Provider>;
}
