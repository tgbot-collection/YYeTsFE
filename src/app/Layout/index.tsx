import * as React from "react";
import { Header } from "./Header";

export const Layout: React.FC = (props) => {
  const { children } = props;

  return (
    <>
      <Header />
      <main>{children}</main>
      <footer>尾</footer>
    </>
  );
};
