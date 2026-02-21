import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get<{ user: any }>("/auth/me");
      return data.user;
    } catch (error: any) {
      // Handle specific redirect logic for 401/404 if needed, 
      // though api.ts interceptor can also handle global 401.
      if (error.message.includes("401") || error.message.includes("404")) {
         await api.post("/auth/logout");
         if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
            window.location.href = "/login";
         }
      }
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await api.post<{ message: string; user: any }>("/auth/login", payload);
      return data.user; // Assuming the API returns the user object on login
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: { name: string; username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await api.post<{ message: string; user: any }>("/auth/register", payload);
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});
