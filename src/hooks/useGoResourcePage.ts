import { useHistory } from "react-router-dom";
import { waitForElement } from "../utils";

export function useGoResourcePage() {
  const history = useHistory();

  return (id: number, uid: string, title?: string) => {
    if (id === 233) {
      history.push(`/discuss#${uid}`);
    } else {
      history.push({
        pathname: "/resource",
        search: `?id=${id}`,
        state: { title: title || "资源页" },
      });
    }
    // jump to element
    waitForElement(uid).then((elm) => {
      document.getElementById(uid)?.scrollIntoView({ behavior: "smooth" });
    });
  };
}
