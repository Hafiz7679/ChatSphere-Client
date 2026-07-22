import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://chatsphere-server-ahyx.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token
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
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
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
        processQueue(null, data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
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

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const logoutUser = () => API.post("/auth/logout");
export const refreshToken = () => API.post("/auth/refresh-token");
export const forgotPassword = (email) => API.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });
export const verifyEmail = (token) => API.get(`/auth/verify-email/${token}`);

// Users
export const getUsers = (params) => API.get("/auth/users", { params });
export const searchUsers = (q) => API.get("/auth/users/search", { params: { q } });
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const updatePassword = (data) => API.put("/auth/password", data);

// Chats
export const getChats = () => API.get("/chat");
export const createChat = (userId) => API.post("/chat", { userId });
export const createGroupChat = (data) => API.post("/chat/group", data);
export const addToGroup = (chatId, userId) => API.put("/chat/group/add", { chatId, userId });
export const removeFromGroup = (chatId, userId) => API.put("/chat/group/remove", { chatId, userId });
export const renameGroup = (chatId, chatName) => API.put("/chat/group/rename", { chatId, chatName });

// Messages
export const getMessages = (sender, receiver, params) =>
  API.get(`/messages/${sender}/${receiver}`, { params });
export const getChatMessages = (chatId, params) =>
  API.get(`/messages/chat/${chatId}`, { params });
export const sendMessage = (data) => API.post("/messages/send", data);
export const deleteMessage = (messageId) => API.delete(`/messages/${messageId}`);
export const editMessage = (messageId, text) => API.put(`/messages/${messageId}`, { text });
export const markAsRead = (chatId) => API.put("/messages/read/mark", { chatId });
export const getChatMedia = (chatId, params) =>
  API.get(`/messages/media/${chatId}`, { params });

// Upload
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

// Admin
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminUsers = (params) => API.get("/admin/users", { params });
export const suspendUser = (userId) => API.put(`/admin/users/${userId}/suspend`);
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);
export const getAdminHealth = () => API.get("/admin/health");

export default API;
