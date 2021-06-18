import * as React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./app/App";

if (process.env.NODE_ENV !== "development" && process.env.REACT_APP_SENTRY_RELEASE) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    release: process.env.REACT_APP_SENTRY_RELEASE,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(<App />, document.getElementById("root"));
