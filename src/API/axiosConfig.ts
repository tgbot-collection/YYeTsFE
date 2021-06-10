import axios from "axios";
const instance = axios.create({
  timeout: 5000,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      if (process.env.NODE_ENV === "development") console.log("Request canceled", error.message);
    } else {
      // TODO: 错误处理
    }
  }
);

export const CancelToken = axios.CancelToken;

export default instance;
