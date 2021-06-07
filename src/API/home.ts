import axios from "./axiosConfig";

export function getHome() {
  return axios.get("/api/top");
}
