import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://hogwarts-and-the-hat-backend-9kr3.onrender.com";

// Zentrale Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// User-Register
export async function register({ username, email, password }) {
  try {
    const response = await api.post("/user/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// User-Login
export async function login({ email, password }) {
  try {
    const response = await api.post("/user/login", { email, password });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// User-Logout
export async function logout() {
  try {
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// User-getme
export async function getMe() {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// UserProgress-get
export async function getUserProgress(userId) {
  try {
    const response = await api.get(`/userProgress/${userId}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// UserProgress-post
export async function initUserProgress(userId) {
  try {
    const response = await api.post("/userProgress/init", { userId });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// UserProgress-Update
export async function updateUserProgress(userId, progressData) {
  try {
    const response = await api.put(`/userProgress/${userId}`, progressData);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

// UserProgress-get House mit den höchsten Score
export async function getTopHouse(userId) {
  try {
    const response = await api.get(`/userProgress/${userId}/top-house`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}
