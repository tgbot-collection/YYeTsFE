import * as React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";

import App from "./app/App";
import { SplashScreenProvider } from "./layout";

if (process.env.NODE_ENV !== "development" && process.env.REACT_APP_SENTRY_RELEASE) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
  });
}

ReactDOM.render(
  <SplashScreenProvider>
    <App />
  </SplashScreenProvider>,
  document.getElementById("root")
);
