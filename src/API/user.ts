import axios from "./axiosConfig";
import { ResourceInfo } from "./resource";

interface PostUserParams {
  username: string;
  password: string;
}

/* 登录 */
export function postUser(params: PostUserParams) {
  return axios.post("/api/user", params);
}

interface patchUserParams {
  resource_id: string;
}

/* 收藏 */
export function patchUser(params: patchUserParams) {
  return axios.patch("/api/user", params);
}

interface GetLikeRes {
  LIKE: Array<{ data: { info: ResourceInfo } }>;
}

/* 个人收藏 */
export function getLike() {
  return axios.get<GetLikeRes>("/api/like");
}
