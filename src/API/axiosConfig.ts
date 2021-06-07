import axios from "axios";
import { AES } from "crypto-js";

const instance = axios.create();

function generateNe1(id: number) {
  return AES.encrypt("/api/resource?id=" + id, "" + id).toString();
}

instance.interceptors.request.use((config) => {
  const { params } = config;
  if (params?.id) config.headers.ne1 = generateNe1(params.id);

  return config;
});

instance.interceptors.response.use((response) => {
  if (response.status === 200) return response.data;

  return response;
});

export default instance;
