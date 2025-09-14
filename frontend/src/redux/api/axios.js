// src/lib/axios.js
import axios from "axios";
import { BASE_URL } from "../constants";

const api = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post("/users/refresh-token");
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token failed → logging out...");
                // Optionally: dispatch logout or redirect
            }
        }
        return Promise.reject(error);
    }
);

export default api;
