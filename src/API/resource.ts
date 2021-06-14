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

// eslint-disable-next-line import/no-mutable-exports
export let cancelGetCaptcha: Canceler;

/* 验证码 */
export function getCaptcha(id: string) {
  return axios.get("/api/captcha", {
    params: { id },
    cancelToken: new CancelToken((c) => {
      cancelGetCaptcha = c;
    }),
  });
}

interface PostCommentParams {
  resource_id: number;
  content: string;
  id: string;
  captcha: string;
}

interface PostCommentRes {
  message: string;
}

/* 发表评论 */
export function postComment(params: PostCommentParams) {
  return axios.post<PostCommentRes>("/api/comment", params);
}

interface GetCommentParams {
  resource_id: number;
  size: number;
  page: number;
}

export interface Comment {
  date: string;
  username: string;
  content: string;
  id: number;
  browser: string;
}

interface GetCommentRes {
  data: Array<Comment>;
  count: number;
  resource_id: number;
}

/* 获取评论 */
export function getComment(params: GetCommentParams) {
  return axios.get<GetCommentRes>("/api/comment", { params });
}
