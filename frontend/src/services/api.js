import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Attach token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/loginAsGuest`);
        const { token } = res.data;

        localStorage.setItem('jwtToken', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
