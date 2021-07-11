import axios from "./axiosConfig";

interface AnnounceParams {
  size: number;
  page: number;
}

export interface AnnounceObject {
  username: string;
  date: string;
  content: string;
}

export interface AnnounceRes {
  data: Array<AnnounceObject>;
  count: number;
}

/* 获取公告 */
export function getAnnounce(params: AnnounceParams) {
  return axios.get<AnnounceRes>("/api/announcement", { params });
}
