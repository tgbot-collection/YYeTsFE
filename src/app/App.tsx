import * as React from "react";
import { Routes } from "./Routes";
import { ThemeProvider } from "./Layout/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
