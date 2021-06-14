import * as React from "react";
import { SnackbarKey, SnackbarProvider } from "notistack";
import { Button } from "@material-ui/core";

import { Routes } from "./Routes";
import { ThemeProvider } from "./Layout/ThemeProvider";
import { UserProvider } from "./Layout/UserContext";

function App() {
  const notistackRef = React.useRef<SnackbarProvider>(null!);
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
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
  );
}

export default App;
