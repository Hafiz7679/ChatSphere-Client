import axios from "axios";
import { getCached, setCache, clearCache, CACHE_KEYS } from "../utils/cache";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfToken = null;

const getCsrfToken = async () => {
  try {
    const { data } = await axios.get(`${API.defaults.baseURL}/csrf-token`, {
      withCredentials: true,
    });
    if (data?.csrfToken) csrfToken = data.csrfToken;
  } catch {
    // CSRF token not critical for all operations
  }
};

getCsrfToken();

const exemptCsrfPaths = [
  "/auth/login", "/auth/register", "/auth/forgot-password",
  "/auth/reset-password", "/auth/refresh-token", "/auth/verify-email",
  "/auth/resend-verification",
];

API.interceptors.request.use(
  (config) => {
    const token = (() => {
      try {
        return localStorage.getItem("token");
      } catch {
        return null;
      }
    })();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (csrfToken && config.method !== "get" && !exemptCsrfPaths.some((p) => config.url?.includes(p))) {
      config.headers["x-csrf-token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        processQueue(null, data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const loginUser = (data) => API.post("/auth/login", data);
export const adminLogin = (data) => API.post("/auth/admin-login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const logoutUser = () => API.post("/auth/logout");
export const refreshToken = () => API.post("/auth/refresh-token");
export const forgotPassword = (email) => API.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });
export const verifyEmail = (token) => API.get(`/auth/verify-email/${token}`);

export const getUsers = async (params) => {
  const key = CACHE_KEYS.USERS;
  if (!params) {
    const cached = getCached(key);
    if (cached) return cached;
  }
  const res = await API.get("/auth/users", { params });
  if (!params) setCache(key, res);
  return res;
};
export const searchUsers = (q) => API.get("/auth/users/search", { params: { q } });
export const getProfile = async () => {
  const cached = getCached(CACHE_KEYS.PROFILE);
  if (cached) return cached;
  const res = await API.get("/auth/profile");
  setCache(CACHE_KEYS.PROFILE, res, 60000);
  return res;
};
export const updateProfile = async (data) => {
  clearCache(CACHE_KEYS.PROFILE);
  return API.put("/auth/profile", data);
};
export const updatePassword = (data) => API.put("/auth/password", data);

export const getChats = async () => {
  const cached = getCached(CACHE_KEYS.CHATS);
  if (cached) return cached;
  const res = await API.get("/chat");
  setCache(CACHE_KEYS.CHATS, res, 30000);
  return res;
};
export const createChat = async (userId) => {
  clearCache(CACHE_KEYS.CHATS);
  return API.post("/chat", { userId });
};
export const createGroupChat = async (data) => {
  clearCache(CACHE_KEYS.CHATS);
  return API.post("/chat/group", data);
};
export const addToGroup = (chatId, userId) => API.put("/chat/group/add", { chatId, userId });
export const removeFromGroup = (chatId, userId) => API.put("/chat/group/remove", { chatId, userId });
export const renameGroup = (chatId, chatName) => API.put("/chat/group/rename", { chatId, chatName });

export const getMessages = async (sender, receiver, params) => {
  const page = params?.page || 1;
  const cacheKey = CACHE_KEYS.MESSAGES(receiver, page);
  if (page === 1) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }
  const res = await API.get(`/messages/${sender}/${receiver}`, { params });
  if (page === 1) setCache(cacheKey, res, 10000);
  return res;
};
export const getChatMessages = async (chatId, params) => {
  const page = params?.page || 1;
  const cacheKey = CACHE_KEYS.MESSAGES(chatId, page);
  if (page === 1) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }
  const res = await API.get(`/messages/chat/${chatId}`, { params });
  if (page === 1) setCache(cacheKey, res, 10000);
  return res;
};
export const sendMessage = async (data) => {
  clearCache("messages");
  return API.post("/messages/send", data);
};
export const deleteMessage = async (messageId) => {
  clearCache("messages");
  return API.delete(`/messages/${messageId}`);
};
export const editMessage = async (messageId, text) => {
  clearCache("messages");
  return API.put(`/messages/${messageId}`, { text });
};
export const markAsRead = (chatId) => API.put("/messages/read/mark", { chatId });
export const reactToMessage = (messageId, emoji) => API.post(`/messages/${messageId}/react`, { emoji });
export const getChatMedia = async (chatId, params) => {
  const cached = getCached(CACHE_KEYS.MEDIA(chatId));
  if (cached) return cached;
  const res = await API.get(`/messages/media/${chatId}`, { params });
  setCache(CACHE_KEYS.MEDIA(chatId), res, 60000);
  return res;
};

export const uploadFile = (formData, onProgress) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onProgress,
  });
export const uploadAvatar = (formData) =>
  API.post("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const uploadVoice = (formData) =>
  API.post("/upload/voice", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAdminStats = () => API.get("/admin/stats");
export const getAdminUsers = (params) => API.get("/admin/users", { params });
export const getAdminUserById = (userId) => API.get(`/admin/users/${userId}`);
export const suspendUser = (userId) => API.put(`/admin/users/${userId}/suspend`);
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);
export const changeUserRole = (userId, role) => API.put(`/admin/users/${userId}/role`, { role });
export const resetUserPassword = (userId, newPassword) => API.put(`/admin/users/${userId}/reset-password`, { newPassword });
export const verifyUserEmail = (userId) => API.put(`/admin/users/${userId}/verify`);
export const disableAccount = (userId) => API.put(`/admin/users/${userId}/disable`);
export const getOnlineUsers = () => API.get("/admin/users/online");
export const getMessageStats = () => API.get("/admin/messages/stats");
export const getAdminAnalytics = () => API.get("/admin/analytics");
export const getAdminReports = () => API.get("/admin/reports");
export const getAdminHealth = () => API.get("/admin/health");
export const getAdminSettings = () => API.get("/admin/settings");

export default API;
