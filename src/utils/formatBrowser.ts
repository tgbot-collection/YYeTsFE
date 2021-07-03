import * as Bowser from "bowser";

export const formatBrowser = (browser: string) => {
  const result = Bowser.parse(browser);
  return {
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
  };
};
