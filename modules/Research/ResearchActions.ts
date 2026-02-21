import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResearchResult } from "@/lib/research";
import { api } from "@/lib/api";

export const performResearch = createAsyncThunk(
  "research/perform",
  async (payload: { topic: string; useDeepSeek?: boolean }, { rejectWithValue }) => {
    try {
      const data = await api.post<ResearchResult>("/research", payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  }
);
