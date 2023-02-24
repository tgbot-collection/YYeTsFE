import * as React from "react";
import { Redirect, Route, Switch, useLocation, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import pangu from "pangu";

import { useAppDispatch, useAuth, useLoginBack } from "hooks";
import { SplashScreen } from "layout";
import { DataBasePage, DiscussPage, HelpPage, HomePage, MePage, ResourcePage, SearchPage } from "./pages";
import { getUser, UserInfo } from "../API";
import { setUsername } from "./pages/login/userSlice";

const StatisticPage = React.lazy(() => import("./modules/statistics"));

export function BasePage() {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { username } = useAuth();
  const login = useLoginBack();
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = React.useState({} as UserInfo);
  React.useEffect(() => {
    pangu.spacingElementById("root");
    document.documentElement.scrollTop = 0;
  }, [location.pathname]);

  React.useEffect(() => {
    if (username) {
      getUser()
        .then((res) => {
          setUserInfo(res.data);
          dispatch(setUsername({ username: res.data.username, group: res.data.group }));
        })
        .catch((error) => {
          if (error.isAxiosError) {
            enqueueSnackbar("登录已失效", {
              variant: "error",
              action: (key) => (
                <Button
                  onClick={() => {
                    closeSnackbar(key);
                    history.push(login);
                  }}
                  color="inherit"
                >
                  去登录
                </Button>
              ),
            });
          }
        });
    }
    //  eslint-disable-next-line
  }, []);

  return (
    <React.Suspense fallback={<SplashScreen />}>
      <Switch>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/resource" component={ResourcePage} />
        <Route exact path="/discuss" component={DiscussPage} />
        <Route exact path="/me">
          {username ? (
            <MePage verified={userInfo.email?.verified} address={userInfo.email?.address} avatar={userInfo.avatar} />
          ) : (
            <Redirect to={login} />
          )}
        </Route>
        <Route exact path="/database" component={DataBasePage} />
        <Route exact path="/help" component={HelpPage} />

        <Route exact path="/statistics" component={StatisticPage} />

        <Route>
          <Redirect to="/404" />
        </Route>
      </Switch>
    </React.Suspense>
  );
}
