import axios from "axios";
const instance = axios.create();

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      // TODO: 错误处理
    }
  }
);

export const CancelToken = axios.CancelToken;

export default instance;
