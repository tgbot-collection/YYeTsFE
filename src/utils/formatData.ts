import * as Bowser from "bowser";

export const formatBrowser = (browser: string) => {
  const result = Bowser.parse(browser);
  return {
    browser: `${result.browser.name} ${result.browser.version}`,
    os: `${result.os.name} ${result.os.version}`,
  };
};

export const formatAvatar = (name: string) => {
  if (/^[\u4E00-\u9FFF]{2}/.test(name)) {
    return name.substr(0, 2);
  }
  return name.substr(0, 3);
};

export const formatComment = (comment: string) => {
  const reg = /<reply value="(.*)">@(.*)<\/reply>/;
  const group = reg.exec(comment);
  if (group) {
    return { text: comment.replace(reg, ""), id: group[1], name: group[2] };
  }
  return { text: comment };
};
