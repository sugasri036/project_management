import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNAUTHORIZED",
    };

    return Promise.reject(customError);
  }
);

export default API;
