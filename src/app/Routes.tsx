import * as React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { AppFrame } from "layout";
import { LoginPage, NotFoundPage } from "./pages";
import { BasePage } from "./BasePage";

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route exact path="/404" component={NotFoundPage} />
        <Route exact path="/login" component={LoginPage} />

        <Route>
          <AppFrame>
            <BasePage />
          </AppFrame>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
