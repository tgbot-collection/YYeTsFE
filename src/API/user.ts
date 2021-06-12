import axios from "./axiosConfig";

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
