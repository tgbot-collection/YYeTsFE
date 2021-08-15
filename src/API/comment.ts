import { Canceler } from "axios";
import axios, { CancelToken } from "./axiosConfig";
import { UserGroup } from "./user";

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
  /* 回复楼中楼时需要 */
  comment_id?: string;
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

interface DeleteCommentParams {
  comment_id: string;
}

export function deleteComment(params: DeleteCommentParams) {
  return axios.delete("/api/comment", { data: params });
}

interface GetCommentParams {
  resource_id: number;
  size: number;
  page: number;
}

export interface Comment {
  id: string;
  resource_id: number;
  date: string;
  username: string;
  content: string;
  browser: string;
  children: Array<Comment>;
  childrenCount: number;
  group: Array<UserGroup>;
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

interface LastCommentParams {
  size: number;
}

export interface LastComment {
  username: string;
  date: string;
  content: string;
  resource_id: number;
  id: string;
  group: Array<UserGroup>;
  cnname: string;
}

interface LastCommentRes {
  count: number;
  data: Array<LastComment>;
}
/* 获取最新评论 */
export function getLastComment(params: LastCommentParams) {
  return axios.get<LastCommentRes>("/api/comment/newest", { params });
}
