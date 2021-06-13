import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { DataBasePage, DiscussPage, HomePage, MePage, ResourcePage, SearchPage } from "./pages";
import { UserContext } from "./Layout/UserContext";
import { useLogin } from "../Hooks";

export function BasePage() {
  const { name } = React.useContext(UserContext);

  const login = useLogin();

  return (
    <Switch>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/search" component={SearchPage} />
      <Route exact path="/resource" component={ResourcePage} />
      <Route exact path="/discuss" component={DiscussPage} />
      <Route exact path="/me">
        {name ? <MePage /> : <Redirect to={login} />}
      </Route>
      <Route exact path="/database" component={DataBasePage} />

      <Route>
        <Redirect to="/404" />
      </Route>
    </Switch>
  );
}
