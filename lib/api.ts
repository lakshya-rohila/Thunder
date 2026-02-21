import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: "/api", // All our internal APIs start with /api
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 seconds timeout
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed, 
    // but since we use cookies for this project, 
    // the browser handles it automatically.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const status = error.response.status;
      
      // Handle 401 Unauthorized (Auto-logout logic could go here if implemented globally)
      if (status === 401) {
        console.warn("Unauthorized access");
        // Optionally redirect to login if not already there
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
           // window.location.href = "/login"; // Uncomment to enable auto-redirect
        }
      }
    }
    return Promise.reject(error);
  }
);

// Generic API helper functions
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  },
  
  // Expose the raw client if needed for special cases (like multipart/form-data)
  client: apiClient,
};

// Common error handler
function handleApiError(error: any): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    return new Error(message);
  }
  return new Error(error.message || "An unexpected error occurred");
}
