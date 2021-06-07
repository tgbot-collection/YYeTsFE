import * as React from "react";

export const Layout: React.FC = (props) => {
  const { children } = props;

  return (
    <>
      <header>头</header>
      <main>{children}</main>
      <footer>尾</footer>
    </>
  );
};
