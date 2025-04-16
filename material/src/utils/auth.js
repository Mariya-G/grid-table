import axios from "axios";
// Базовый URL API
// admin / 19qhYXCA

//export const API_URL = import.meta.env.VITE_API_URL;
export const API_URL = "https://test.service.aurit-ural.ru/api";
// Создаём экземпляр axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//Авторизация
export const authorize = async ({ username, password }) => {
  console.log(username, password);
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    console.log(response);
    const { access, refresh } = response.data;
    return { access, refresh };
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
};

// Функция для обновления токена
export const refreshToken = async () => {
  //const { tokenRefresh } = useAuth();
  try {
    const refresh = localStorage.getItem("refresh_token"); // Достаем refresh-токен из хранилища
    if (!refresh) throw new Error("Refresh token not found");

    const response = await axios.post(`${API_URL}/login/refresh/`, {
      refresh,
    });
    const { access } = response.data;

    localStorage.setItem("access_token", access); // Обновляем токен в хранилище
    return access;
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login"; // Перенаправляем на страницу логина
    return null;
  }
};

// Интерцептор запросов: добавляем access-токен в заголовок
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор ответов: если токен истёк — обновляем и повторяем запрос
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // Если запрос уже пытались повторить, но он снова упал — выходим
      if (originalRequest._retry) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Помечаем запрос как повторный
      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Повторяем исходный запрос с новым токеном
      }
    }
    return Promise.reject(error);
  }
);

export default api;
