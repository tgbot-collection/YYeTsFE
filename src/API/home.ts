import { Canceler } from "axios";
import axios, { CancelToken } from "./axiosConfig";

export let cancelGetHome: void | Canceler;

export function getHome() {
  return axios.get("/api/top", {
    cancelToken: new CancelToken((c) => (cancelGetHome = c)),
  });
}
