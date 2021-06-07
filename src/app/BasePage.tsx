import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { HomePage, SearchPage } from "./pages";

export function BasePage() {
  return (
    <Switch>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/search" component={SearchPage} />

      <Route>
        <Redirect to="/404" />
      </Route>
    </Switch>
  );
}
