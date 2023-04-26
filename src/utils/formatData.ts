import * as Bowser from "bowser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const md5 = require("md5");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Asia/Shanghai");

export const formatBrowser = (browser: string) => {
  const result = Bowser.parse(browser);
  return {
    browser: `${result.browser.name || ""} ${result.browser.version?.split(".").slice(0, 2).join(".") || ""}`,
    os: `${result.os.name || ""} ${result.os.version || ""}`,
  };
};

export const formatAvatar = (name: string) => {
  if (/^[\u4E00-\u9FFF]{2}/.test(name)) {
    return name.substr(0, 2);
  }
  return name.substr(0, 3);
};

export const getGravatar = (name: string, hasAvatar: boolean, hash: string) => {
  const hashQuery = hash ? `?hash=${hash}` : "";
  const prefix = process.env.NODE_ENV !== "development" ? "https://gravatar.webp.se" : "";

  if (hasAvatar) {
    return `${prefix}/api/user/avatar/${name}${hashQuery}`;
  }

  if (name && name.includes("@")) {
    return `${prefix}/avatar/${md5(name)}`;
  }
  return "";
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
  // time date in db is always CST, so we need to read it by default timezone using dayjs.tz
  const date = dayjs.tz(rowDate).locale("zh-cn");
  const now = dayjs();

  if (!date.isValid()) return "时间格式错误";

  if (date.isAfter(now.startOf("day"))) return date.fromNow();

  if (date.isAfter(now.startOf("year"))) return date.format("YYYY-MM-DD HH:mm");

  return date.format("YYYY-MM-DD HH:mm");
};
