import { Canceler } from "axios";
import axios, { CancelToken } from "./axiosConfig";

interface ResourceLink {
  address: string;
  passwd: string;
  way: string;
  way_cn: string;
}

export interface ResourceDetail {
  dateline: string;
  episode: string;
  files: Array<ResourceLink>;
  itemid: string;
  name: string;
  yyets_trans: number;
  size: string;
}

interface Season {
  [key: string]: Array<ResourceDetail>;
}

export interface AddressInfo {
  formats: Array<string>;
  items: Season;
  season_cn: string;
  season_num: string;
}

export interface ResourceInfo {
  id: number;
  views: number;
  cnname: string;
  enname: string;
  aliasname: string;
  area: string;
  channel: string;
  channel_cn: string;
  year: Array<number>;
}

export interface GetResourceByIDRes {
  data: {
    info: ResourceInfo;
    list: Array<AddressInfo>;
  };
  info: string;
  status: number;
  is_like: boolean;
}

// eslint-disable-next-line import/no-mutable-exports
export let cancelGetResourceByID: Canceler;

/* 资源页 */
export function getResourceByID(id: string) {
  return axios.get<GetResourceByIDRes>("/api/resource", {
    params: { id },
    cancelToken: new CancelToken((c) => {
      cancelGetResourceByID = c;
    }),
  });
}

export interface DoubanInfo {
  name: string;
  doubanId: number;
  doubanLink: string;
  posterLink: string;
  resourceId: number;
  rating: number;
  actors: Array<string>;
  directors: Array<string>;
  genre: Array<string>;
  releaseDate: string;
  episodeCount: string;
  episodeDuration: string;
  writers: Array<string>;
  year: string;
  introduction: string;
}
// eslint-disable-next-line import/no-mutable-exports
export let cancelGetDoubanByID: Canceler;

export function getDoubanByID(id: string) {
  return axios.get<DoubanInfo>("/api/douban", {
    params: { resource_id: id },
    cancelToken: new CancelToken((c) => {
      cancelGetDoubanByID = c;
    }),
  });
}

interface PatchUserParams {
  resource_id: string;
}

/* 收藏 */
export function patchLike(params: PatchUserParams) {
  return axios.patch("/api/like", params);
}

export type LastResourceInfo = {
  name: string;
  timestamp: string;
  size: string;
  resource_id: number;
  res_name: string;
  date: string;
};

interface GetLastResourceRes {
  data: Array<LastResourceInfo>;
}

/* 获取最新资源 */
export function getLastResource() {
  return axios.get<GetLastResourceRes>("/api/resource/latest", { params: { size: 5 } });
}
