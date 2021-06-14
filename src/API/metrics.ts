import axios from "./axiosConfig";

/**
 * top: 排行榜
 * home: 首页
 * search: 搜索
 * database: 数据库
 * resource: 资源页
 */
type MetricsType = "top" | "home" | "search" | "database" | "resource";

export function postMetrics(type: MetricsType) {
  return axios.post("/api/metrics", { type });
}
