import axios from "axios";

export function getResourceKeyword(id: number) {
  return axios.get("/api/resource", { params: { id } });
}
