import * as React from "react";

const SplashScreenContext = React.createContext<React.Dispatch<React.SetStateAction<number>>>(null!);

export function SplashScreenProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [count, setCount] = React.useState(0);
  const visible = count > 0;

  React.useEffect(() => {
    const splashScreen = document.querySelector("#splash-screen");
    // Show SplashScreen
    if (splashScreen && visible) {
      splashScreen.classList.remove("hidden");

      return () => {
        splashScreen.classList.add("hidden");
      };
    }

    // Hide SplashScreen
    let timeout: NodeJS.Timeout;
    if (splashScreen && !visible) {
      timeout = setTimeout(() => {
        splashScreen.classList.add("hidden");
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [visible]);

  return <SplashScreenContext.Provider value={setCount}>{children}</SplashScreenContext.Provider>;
}

export function SplashScreen(props: { visible?: boolean }) {
  const { visible = true } = props;
  const setCount = React.useContext(SplashScreenContext);

  React.useEffect(() => {
    if (!visible) {
      return () => {};
    }
    setCount((prev) => prev + 1);

    return () => {
      setCount((prev) => prev - 1);
    };
  }, [setCount, visible]);

  return null;
}
