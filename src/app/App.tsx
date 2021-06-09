import * as React from "react";
import { SnackbarProvider } from "notistack";

import { Routes } from "./Routes";
import { ThemeProvider } from "./Layout/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider
        preventDuplicate
        maxSnack={2}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={3000}
      >
        <Routes />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
