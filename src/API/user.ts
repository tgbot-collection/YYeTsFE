import axios from "./axiosConfig";
import { ResourceInfo } from "./resource";

export interface PostUserParams {
  username: string;
  password: string;
  captcha: string;
  captcha_id: string;
}

export interface PatchUserParams {
  email: string;
}
export interface VerifyEmailParams {
  code: string;
}

interface PatchInfo {
  status_code: number;
  status: boolean;
  message: string;
}

export type UserGroup = "admin" | "user";

export interface UserInfo {
  username: string;
  /* 注册时间 */
  date: string;
  browser: string;
  group: Array<UserGroup>;
  email: {
    verified: boolean;
    address: string;
  };
  avatar: string;
}
/* 登录 */
export function postUser(params: PostUserParams) {
  return axios.post<UserInfo>("/api/user", params);
}

/* 获取当前用户信息 */
export function getUser() {
  return axios.get<UserInfo>("/api/user");
}

interface GetLikeRes {
  LIKE: Array<{ data: { info: ResourceInfo } }>;
}
/* 个人收藏 */
export function getLike() {
  return axios.get<GetLikeRes>("/api/like");
}

export function patchUser(params: PatchUserParams) {
  return axios.patch<PatchInfo>("/api/user", params);
}

export function verifyEmail(params: VerifyEmailParams) {
  return axios.post("/api/user/email", params);
}

export function getAvatar() {
  return axios.get("/api/user/avatar");
}

export function uploadAvatar(data: FormData) {
  return axios.post("/api/user/avatar", data);
}
