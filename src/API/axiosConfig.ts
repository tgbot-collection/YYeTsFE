import axios from "axios";
import { AES } from "crypto-js";

const instance = axios.create({
  baseURL: "http://localhost:9000",
});

function generateNe1(id: number) {
  return AES.encrypt("/api/resource?id=" + id, "" + id).toString();
}

instance.interceptors.request.use((config) => {
  console.log(config);
  const { params } = config;
  if (params.id) config.headers.ne1 = generateNe1(params.id);

  return config;
});

export default instance;
