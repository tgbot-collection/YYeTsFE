import { LinkProps, useLocation } from "react-router-dom";

export function useLogin() {
  const location = useLocation();

  const url: LinkProps<{ ref: string }>["to"] = {
    pathname: "/login",
    state: { ref: location.pathname + location.search },
  };

  return url;
}
