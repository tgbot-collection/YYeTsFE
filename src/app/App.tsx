import * as React from "react";
import { SnackbarProvider } from "notistack";

import { Routes } from "./Routes";
import { ThemeProvider } from "./Layout/ThemeProvider";
import { UserProvider } from "./Layout/UserContext";

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          autoHideDuration={3000}
        >
          <Routes />
        </SnackbarProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
