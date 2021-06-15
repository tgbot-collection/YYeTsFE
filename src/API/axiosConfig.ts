import axios from "axios";

const instance = axios.create({
  timeout: 5000,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === "development") console.log("Request canceled", error.message);

      return null;
    }

    if (error.code === "ECONNABORTED" && error.message.indexOf("timeout") !== -1) {
      return Promise.reject(new Error("请求超时，请重试"));
    }

    if (error.isAxiosError && error.response?.status === 401) {
      return Promise.reject(new Error("401, 请尝试重新登录"));
    }

    return Promise.reject(error);
  }
);

export const { CancelToken } = axios;

export default instance;
