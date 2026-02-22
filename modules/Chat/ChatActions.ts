import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export const createChat = createAsyncThunk(
  "chat/create",
  async (
    payload: {
      prompt: string;
      data: { name: string; html: string; css: string; js: string; jsx?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const json = await api.post<any>("/chat/create", {
        prompt: payload.prompt,
        title: payload.data.name || payload.prompt.slice(0, 80),
        generatedHTML: payload.data.html,
        generatedCSS: payload.data.css,
        generatedJS: payload.data.js,
        generatedJSX: payload.data.jsx,
      });
      return json?.chat?.id ?? json?.chat?._id ?? json?._id ?? null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to save chat");
    }
  }
);

export const generateComponent = createAsyncThunk(
  "chat/generate",
  async (
    payload: {
      prompt: string;
      context?: any;
      mode: string;
      projectType: string;
      styleMode: string;
      framework?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await api.post<any>("/generate", payload);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      return rejectWithValue(message);
    }
  }
);
