import axios from "./axiosConfig";

/**
 * top: 排行榜
 * home: 首页
 * search: 搜索
 * me: 个人中心
 * database: 数据库
 * help: 帮助页
 * user: 注册｜登陆
 * favorite: 收藏
 * comment: 评论
 * download: 下载资源
 * share: 分享
 * resource: 资源页
 * discuss: 留言版
 */
type MetricsType =
  | "top"
  | "home"
  | "search"
  | "me"
  | "database"
  | "resource"
  | "help"
  | "user"
  | "favorite"
  | "unFavorite"
  | "comment"
  | "download"
  | "multiDownload"
  | "share"
  | "discuss"
  | "extra"
  | "backOld";

export function postMetrics(type: MetricsType) {
  return axios.post("/api/metrics", { type });
}
