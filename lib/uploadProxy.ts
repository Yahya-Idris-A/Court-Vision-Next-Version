// lib/axios.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL = process.env.SECRET_API_BASE_URL;

const axiosUpload = axios.create({ baseURL });

// Handler request
const requestHandler = (
  request: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  return request;
};

// Handler response
const responseHandler = (response: AxiosResponse): any => {
  return response.data;
};

// Handler error
const errorHandler = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const status = error.response.status;

    if (status === 401 || status === 403) {
      // Hapus localStorage dan redirect ke login
      // if (typeof window !== "undefined") {
      //   localStorage.clear();
      //   window.location.href = "/sign-in";
      // }
      console.error("Unauthorized or Forbidden:", error.response.data);
    }

    if (status === 500) {
      // Ganti dengan handler toast error jika ada
      console.error("Internal Server Error");
    }

    return Promise.reject(error);
  } else {
    console.error("No response from server:", error.message);
    return Promise.reject(error);
  }
};

axiosUpload.interceptors.request.use(requestHandler, errorHandler);
axiosUpload.interceptors.response.use(responseHandler, errorHandler);

export default axiosUpload;
