import axios from "./axiosConfig";
import { ResourceInfo } from "./resource";

export interface PostUserParams {
  username: string;
  password: string;
}

/* 登录 */
export function postUser(params: PostUserParams) {
  return axios.post("/api/user", params);
}

interface PatchUserParams {
  resource_id: string;
}

/* 收藏 */
export function patchUser(params: PatchUserParams) {
  return axios.patch("/api/user", params);
}

interface GetLikeRes {
  LIKE: Array<{ data: { info: ResourceInfo } }>;
}

/* 个人收藏 */
export function getLike() {
  return axios.get<GetLikeRes>("/api/like");
}
