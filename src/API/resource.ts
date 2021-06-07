import axios from "axios";

export function getResourceKeyword() {
  return axios.get("/", { params: { id: 1 } });
}
