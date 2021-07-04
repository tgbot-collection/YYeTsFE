import * as React from "react";
import { SnackbarKey, SnackbarProvider } from "notistack";
import { Button } from "@material-ui/core";
import { Provider } from "react-redux";

import { store } from "_redux";
import { Routes } from "./Routes";
import { ThemeProvider } from "../Layout/ThemeProvider";
import { UserProvider } from "../Layout/UserContext";

function App() {
  const notistackRef = React.useRef<SnackbarProvider>(null!);
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <Provider store={store}>
      <UserProvider>
        <ThemeProvider>
          <SnackbarProvider
            ref={notistackRef}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            autoHideDuration={3000}
            action={(key) => (
              <Button onClick={onClickDismiss(key)} color="inherit">
                关闭
              </Button>
            )}
          >
            <Routes />
          </SnackbarProvider>
        </ThemeProvider>
      </UserProvider>
    </Provider>
  );
}

export default App;
