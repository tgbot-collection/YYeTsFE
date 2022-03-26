import axios from "./axiosConfig";

type MetricsType =
  | "top" // 排行榜
  | "home" // 首页
  | "search" // 搜索
  | "me" // 个人中心
  | "database" // 数据库
  | "resource" // 资源页
  | "help" // 帮助页
  | "user" // 注册｜登录
  | "favorite" // 收藏
  | "unFavorite" // 取消收藏
  | "comment" // 发布评论
  | "download" // 下载
  | "multiDownload" // 批量下载
  | "ResilioSync" // 同步
  | "share" // 分享
  | "discuss" // 留言板
  | "extra" // 外链
  | "backOld" // 返回旧版
  | "copyComment"; // 复制评论

export function postMetrics(type: MetricsType) {
  return axios.post("/api/metrics", { type });
}

type MetricsObject = {
  [p in MetricsType]?: number;
};

export interface MetricsInfo extends MetricsObject {
  date: string;
}

interface MetricsRes {
  metrics: Array<MetricsInfo>;
}

export function getMetrics() {
  return axios.get<MetricsRes>("/api/metrics");
}
