import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import communityReducer from "./slices/communitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    community: communityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
