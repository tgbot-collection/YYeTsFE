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

      return null;
    }
    if (error.code === "ECONNABORTED" && error.message.indexOf("timeout") !== -1) {
      return Promise.reject(Error("请求超时"));
    }

    return Promise.reject(error);
  }
);

export const CancelToken = axios.CancelToken;

export default instance;
