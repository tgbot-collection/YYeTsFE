import * as React from "react";
import { SnackbarProvider } from "notistack";

import { Routes } from "./Routes";
import { ThemeProvider } from "./Layout/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider
        maxSnack={2}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Routes />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
