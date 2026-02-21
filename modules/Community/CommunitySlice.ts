import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCommunityFeed, postToCommunity } from "./CommunityActions";

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
  posting: boolean;
  postError: string | null;
}

const initialState: CommunityState = {
  chats: [],
  sort: "latest",
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  posting: false,
  postError: null,
};

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
    clearPostError(state) {
      state.postError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityFeed.fulfilled, (state, action) => {
        state.loading = false;
        // Check if payload has the expected structure
        if (action.payload && action.payload.chats) {
            state.chats = action.payload.chats;
            state.totalPages = action.payload.pagination.totalPages;
        }
      })
      .addCase(fetchCommunityFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Something went wrong";
      })
      // Post to Community
      .addCase(postToCommunity.pending, (state) => {
        state.posting = true;
        state.postError = null;
      })
      .addCase(postToCommunity.fulfilled, (state) => {
        state.posting = false;
      })
      .addCase(postToCommunity.rejected, (state, action) => {
        state.posting = false;
        state.postError = (action.payload as string) || action.error.message || "Failed to post";
      });
  },
});

export const { setSort, setPage, clearPostError } = communitySlice.actions;
export default communitySlice.reducer;
