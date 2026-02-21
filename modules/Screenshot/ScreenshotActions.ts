import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export const analyzeScreenshot = createAsyncThunk(
  "screenshot/analyze",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const data = await api.post<any>("/analyze-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
);
