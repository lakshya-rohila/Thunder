import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await fetch("/api/auth/me");
  if (!res.ok) throw new Error("Not authenticated");
  const data = await res.json();
  return data.user;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
      if (!action.payload) state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          username: action.payload.username,
          email: action.payload.email,
        };
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export const { logout, setLoggedIn } = authSlice.actions;
export default authSlice.reducer;
