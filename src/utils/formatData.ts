import * as Bowser from "bowser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

const md5 = require('md5');

dayjs.extend(relativeTime);

export const formatBrowser = (browser: string) => {
  const result = Bowser.parse(browser);
  return {
    browser: `${result.browser.name || ""} ${result.browser.version?.split(".").slice(0, 2).join(".") || ""}`,
    os: `${result.os.name || ""} ${result.os.version || ""}`,
  };
};

export const formatAvatar = (name: string) => {
  if (name.indexOf("@") > -1) {
    const hash = md5(name);
    return `https://www.gravatar.com/avatar/${hash}`;
  }
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

export const formatDate = (rowDate: string) => {
  const date = dayjs(rowDate).locale("zh-cn");
  const now = dayjs();

  if (!date.isValid()) return "时间格式错误";

  if (date.isAfter(now.startOf("day"))) return date.fromNow();

  if (date.isAfter(now.startOf("year"))) return date.format("M-D HH:mm");

  return date.format("YYYY-MM-DD HH:mm");
};
