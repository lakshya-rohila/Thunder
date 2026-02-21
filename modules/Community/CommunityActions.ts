import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export const fetchCommunityFeed = createAsyncThunk(
  "community/fetchFeed",
  async ({ page, sort }: { page: number; sort: "latest" | "likes" }, { rejectWithValue }) => {
    try {
      const data = await api.get<{ chats: any[], pagination: any }>(
        `/community/feed?page=${page}&limit=12&sort=${sort}`
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const postToCommunity = createAsyncThunk(
  "community/post",
  async ({ chatId, isPublic, description }: { chatId: string; isPublic: boolean; description: string }, { rejectWithValue }) => {
    try {
      const data = await api.post<{ message: string }>(
        "/community/post",
        { chatId, isPublic, description }
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
