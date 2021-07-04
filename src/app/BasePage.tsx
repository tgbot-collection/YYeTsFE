import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { useAuth, useLoginBack } from "hooks";
import { DataBasePage, DiscussPage, HelpPage, HomePage, MePage, ResourcePage, SearchPage } from "./pages";

export function BasePage() {
  const { username } = useAuth();

  const login = useLoginBack();

  return (
    <Switch>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/search" component={SearchPage} />
      <Route exact path="/resource" component={ResourcePage} />
      <Route exact path="/discuss" component={DiscussPage} />
      <Route exact path="/me">
        {username ? <MePage /> : <Redirect to={login} />}
      </Route>
      <Route exact path="/database" component={DataBasePage} />
      <Route exact path="/help" component={HelpPage} />

      <Route>
        <Redirect to="/404" />
      </Route>
    </Switch>
  );
}
