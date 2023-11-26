import * as React from "react";
import ReactDOM from "react-dom";

import App from "./app/App";
import { SplashScreenProvider } from "./layout";

ReactDOM.render(
  <SplashScreenProvider>
    <App />
  </SplashScreenProvider>,
  document.getElementById("root")
);
