import api from "./api";

// Hàm hỗ trợ trích xuất lỗi từ Spring Boot
const extractErrorMessage = (error: any, defaultMessage: string) => {
  // Không có response -> Máy chủ tắt hoặc mất mạng
  if (!error.response) {
    return "Không thể kết nối đến máy chủ (Backend chưa chạy).";
  }

  if (error.response && error.response.data) {
    // Spring Boot thường trả message trong trường "message" hoặc trả trực tiếp chuỗi
    if (typeof error.response.data === "string") return error.response.data;
    if (error.response.data.message) return error.response.data.message;
  }
  return defaultMessage;
};

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const data = response.data;
      
      const token = typeof data === "string" ? data : data.token;
      
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
      }
      
      return data;
    } catch (error: any) {
      throw extractErrorMessage(error, "Đăng nhập thất bại");
    }
  },

  register: async (fullName: string, email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/register", {
        name: fullName, // Backend Spring Boot dùng trường "name" thay vì "fullName"
        email: email,
        password: password,
      });
      return response.data;
    } catch (error: any) {
      throw extractErrorMessage(error, "Đăng ký thất bại");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  },

  getCurrentUser: () => {
    return localStorage.getItem("userEmail");
  },
};
