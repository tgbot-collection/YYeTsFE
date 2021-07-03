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

export interface ExtraResult {
  name: string;
  url: string;
  class: string;
}

interface GetSearchKwRes {
  data: Array<{ data: { info: ResourceInfo } }>;
  /* 外站结果 */
  extra: Array<ExtraResult>;
}

/* 搜索剧集 */
export function getSearchKw(keyword: string) {
  return axios.get<GetSearchKwRes>("/api/resource", { params: { keyword }, timeout: 10 * 1000 });
}
