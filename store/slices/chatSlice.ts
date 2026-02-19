import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ComponentData {
  name: string;
  html: string;
  css: string;
  js: string;
}

interface ChatState {
  messages: Message[];
  componentData: ComponentData | null;
  activeChatId: string | null;
  savedChatId: string | null;
  isPublic: boolean;
  loading: boolean;
  mode: "prompt" | "screenshot";
  error: string | null;
  sidebarCollapsed: boolean;
}

const initialState: ChatState = {
  messages: [],
  componentData: null,
  activeChatId: null,
  savedChatId: null,
  isPublic: false,
  loading: false,
  mode: "prompt",
  error: null,
  sidebarCollapsed: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setComponentData(state, action: PayloadAction<ComponentData | null>) {
      state.componentData = action.payload;
    },
    setActiveChatId(state, action: PayloadAction<string | null>) {
      state.activeChatId = action.payload;
      state.savedChatId = action.payload;
    },
    setSavedChatId(state, action: PayloadAction<string | null>) {
      state.savedChatId = action.payload;
    },
    setIsPublic(state, action: PayloadAction<boolean>) {
      state.isPublic = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMode(state, action: PayloadAction<"prompt" | "screenshot">) {
      state.mode = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    resetChat(state) {
      state.messages = [];
      state.componentData = null;
      state.activeChatId = null;
      state.savedChatId = null;
      state.isPublic = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setComponentData,
  setActiveChatId,
  setSavedChatId,
  setIsPublic,
  setLoading,
  setMode,
  setError,
  setSidebarCollapsed,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
