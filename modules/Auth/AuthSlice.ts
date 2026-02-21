import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUser, logoutUser, loginUser, registerUser } from "./AuthActions";

interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  dailyCredits?: number;
}

export interface AuthState {
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
      if (!action.payload) state.user = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
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
          dailyCredits: action.payload.dailyCredits,
        };
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          username: action.payload.username,
          email: action.payload.email,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Typically registration might not auto-login depending on API, 
        // but if it does return user, we set it.
        // Based on Actions, it returns user.
        // However, standard flow might require email verification or explicit login.
        // The original code redirected to login.
        // Let's assume for now it DOES NOT auto login to be safe, or just updates state if API returns user.
        // If the previous code redirected to /login, then we probably don't need to set isLoggedIn=true here
        // unless we want to change behavior.
        // Re-reading original code: "router.push("/login");"
        // So registration just succeeds.
        state.error = null; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      });
  },
});

export const { setLoggedIn, setError } = authSlice.actions;
export default authSlice.reducer;
