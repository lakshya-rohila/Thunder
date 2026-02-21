import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/modules/Auth/AuthSlice";
import chatReducer from "@/modules/Chat/ChatSlice";
import communityReducer from "@/modules/Community/CommunitySlice";
import imageGenerationReducer from "@/modules/ImageGeneration/ImageGenerationSlice";
import codeAssistantReducer from "@/modules/CodeAssistant/CodeAssistantSlice";
import researchReducer from "@/modules/Research/ResearchSlice";
import screenshotReducer from "@/modules/Screenshot/ScreenshotSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    community: communityReducer,
    imageGeneration: imageGenerationReducer,
    codeAssistant: codeAssistantReducer,
    research: researchReducer,
    screenshot: screenshotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
