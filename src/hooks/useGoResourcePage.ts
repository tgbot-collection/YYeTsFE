import { useHistory } from "react-router-dom";

export function useGoResourcePage() {
  const history = useHistory();

  return (id: number, title?: string) => {
    if (id === 233) {
      history.push("/discuss");
    } else {
      history.push({
        pathname: "/resource",
        search: `?id=${id}`,
        state: { title: title || "资源页" },
      });
    }
  };
}
