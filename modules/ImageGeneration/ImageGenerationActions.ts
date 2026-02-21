import { createAsyncThunk } from "@reduxjs/toolkit";
import { ImageGenerationRequest } from "@/lib/image-gen";
import { api } from "@/lib/api";

export const generateImage = createAsyncThunk(
  "imageGeneration/generate",
  async (payload: { prompt: string; modelId: string }, { rejectWithValue }) => {
    try {
      const blob = await api.post<Blob>("/image", payload, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(blob);
      return url;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
);
