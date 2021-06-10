import axios from "./axiosConfig";

interface PostUserParams {
  username: string;
  password: string;
}

/* 登录 */
export function postUser(params: PostUserParams) {
  return axios.post("/api/user", params);
}
