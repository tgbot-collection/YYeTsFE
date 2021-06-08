import * as React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

import { Header } from "./Header";
import { Footer } from "./Footer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: "1 0 100%",
    },
  })
);

export const Layout: React.FC = (props) => {
  const { children } = props;

  const classes = useStyles();

  return (
    <>
      <Header />
      <main className={classes.root}>{children}</main>
      <Footer />
    </>
  );
};
