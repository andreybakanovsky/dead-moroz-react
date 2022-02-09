import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("auth-token");

    if (authToken) {
      config.headers.authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
