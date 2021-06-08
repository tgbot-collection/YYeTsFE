import { Canceler } from "axios";
import axios, { CancelToken } from "./axiosConfig";

export interface MovieInfo {
  id: number;
  cnname: string;
  enname: string;
  aliasname: string;
  expire: string;
  area: string;
  channel: string;
  channel_cn: string;
  views: number;
  year: Array<number>;
}

export interface MovieList {
  data: {
    info: MovieInfo;
  };
}

export interface GetTopRes {
  ALL: Array<MovieList>;
  JP: Array<MovieList>;
  KR: Array<MovieList>;
  UK: Array<MovieList>;
  US: Array<MovieList>;
  class: {
    [key: string]: string;
  };
}

export let cancelGetTop: Canceler;

export function getTop() {
  return axios.get<GetTopRes>("/api/top", {
    cancelToken: new CancelToken((c) => (cancelGetTop = c)),
  });
}
