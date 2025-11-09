import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send/receive cookies
});


axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );


axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect; just return readable message
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Server error occurred";
    return Promise.reject(new Error(backendMsg));
  }
);

export default axiosClient;
