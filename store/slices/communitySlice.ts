import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ChatCard {
  _id: string;
  title: string;
  description: string;
  generatedHTML: string;
  generatedCSS: string;
  generatedJS: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isPublic?: boolean;
  author: {
    name: string;
    username?: string;
  };
}

interface CommunityState {
  chats: ChatCard[];
  sort: "latest" | "likes";
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  chats: [],
  sort: "latest",
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchCommunityFeed = createAsyncThunk(
  "community/fetchFeed",
  async ({ page, sort }: { page: number; sort: "latest" | "likes" }) => {
    const res = await fetch(
      `/api/community/feed?page=${page}&limit=12&sort=${sort}`,
    );
    if (!res.ok) throw new Error("Failed to fetch feed");
    return await res.json();
  },
);

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<"latest" | "likes">) {
      state.sort = action.payload;
      state.page = 1; // Reset page on sort change
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommunityFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchCommunityFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setSort, setPage } = communitySlice.actions;
export default communitySlice.reducer;
