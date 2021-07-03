import { Canceler } from "axios";
import axios, { CancelToken } from "./axiosConfig";

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
export type UserGroup = "admin" | "user";

export interface Comment {
  date: string;
  username: string;
  content: string;
  id: number;
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
