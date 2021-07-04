import { LinkProps, useLocation } from "react-router-dom";

export function useLoginBack() {
  const location = useLocation();

  const url: LinkProps<{ ref: string }>["to"] = {
    pathname: "/login",
    state: { ref: location.pathname + location.search },
  };

  return url;
}
