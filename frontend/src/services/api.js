import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// One axios instance used everywhere
const api = axios.create({ baseURL });

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("jwtToken");
  if (t) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

// On 401, try a guest login once and retry the original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!error.response || original?._retry) return Promise.reject(error);
    if (original?.url?.includes("/auth/loginAsGuest"))
      return Promise.reject(error);

    if (error.response.status === 401) {
      original._retry = true;
      try {
        const r = await axios.get(`${baseURL}/auth/loginAsGuest`);
        const newToken = r?.data?.token;
        if (newToken) {
          localStorage.setItem("jwtToken", newToken);
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original); // retry with fresh token
        }
      } catch (e) {
        console.error("Guest login failed:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { api };
