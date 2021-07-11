import * as React from "react";
import { createTheme, CssBaseline, ThemeProvider as MaterialTheme, useMediaQuery } from "@material-ui/core";

interface ThemeProviderPropTypes {
  children: React.ReactNode;
}

export const ThemeProvider = (props: ThemeProviderPropTypes) => {
  const { children } = props;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme(
    /**
     * @see https://material-ui.com/customization/themes/#theme-configuration-variables
     */
    {
      palette: {
        type: prefersDarkMode ? "dark" : "light",
      },
    }
  );

  return (
    <MaterialTheme theme={theme}>
      <CssBaseline />
      {children}
    </MaterialTheme>
  );
};
