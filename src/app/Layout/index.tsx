import * as React from "react";
import { createStyles, makeStyles } from "@material-ui/core";

import { Header } from "./Header";
import { Footer } from "./Footer";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: "1 0 100%",
    },
  })
);

interface LayoutPropTypes {
  children: React.ReactNode;
}

export const Layout = (props: LayoutPropTypes) => {
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
