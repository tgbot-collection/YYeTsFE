import axios from "./axiosConfig";

export function getHome() {
  return axios.get("/api/resource", {
    params: { id: 38413 },
  });
}
