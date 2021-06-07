import * as React from "react";
import { getHome } from "API";

export function HomePage() {
  document.title = "首页";

  React.useEffect(() => {
    getHome().then((res) => {
      console.log(res);
    });
  }, []);

  return <div>首页</div>;
}
