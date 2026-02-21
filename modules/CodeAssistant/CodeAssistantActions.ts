import { createAsyncThunk } from "@reduxjs/toolkit";
import { CodeAssistantRequest } from "@/lib/code-assistant";
import { api } from "@/lib/api";

export const generateCode = createAsyncThunk(
  "codeAssistant/generate",
  async (payload: { prompt: string; language: string }, { rejectWithValue }) => {
    try {
      const data = await api.post<any>("/code", payload);
      return data.code;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
);
