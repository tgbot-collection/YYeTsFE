import { Canceler } from "axios";
import axios, { CancelToken } from "./axiosConfig";
import { ResourceInfo } from "./resource";

export interface MovieList {
  data: {
    info: ResourceInfo;
  };
}

export interface GetTopRes {
  ALL: Array<MovieList>;
  JP: Array<MovieList>;
  KR: Array<MovieList>;
  UK: Array<MovieList>;
  US: Array<MovieList>;
  class: {
    [key: string]: string;
  };
}

// eslint-disable-next-line import/no-mutable-exports
export let cancelGetTop: Canceler;

/* 获取排行榜 */
export function getTop() {
  return axios.get<GetTopRes>("/api/top", {
    cancelToken: new CancelToken((c) => {
      cancelGetTop = c;
    }),
  });
}

export interface SubtitleResult {
  _id:string;
  id: number;
  cnname: string; // 中文名称
  enname: string; // 英文名称
  resourceid: number; // 资源 ID
  season: number; // 季度
  episode: number; // 集数
  segment: string; // 分段信息
  segment_num: number; // 分段编号
  source: string; // 来源
  category: string; // 分类
  lang: string; // 语言
  format: string; // 格式
  file: string; // 文件路径
  filename: string; // 文件名
  remark: string; // 备注
  views: number; // 浏览次数
  downloads: number; // 下载次数
  comments: number; // 评论数
  updater: number; // 更新者 ID
  updatetime: number; // 更新时间
  operator: number; // 操作者 ID
  dateline: number; // 数据时间线
}

export interface CommentResult {
  username: string;
  date: string;
  comment: string;
  commentID: "string";
  resourceID: number;
  resourceName: string;
  origin: string;
  hasAvatar: boolean;
  hash: string;
}

interface GetSearchKwRes {
  resource: Array<ResourceInfo>;
  comment: Array<CommentResult>;
  subtitle: Array<SubtitleResult>;
}

/* 搜索剧集 */
export function getSearchKw(keyword: string, type: string) {
  return axios.get<GetSearchKwRes>("/api/resource", { params: { keyword, type }, timeout: 10 * 1000 });
}
