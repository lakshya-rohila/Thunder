import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  role: "user" | "ai";
  content: string;
  questions?: {
    id: string;
    text: string;
    options: string[];
  }[];
}

interface FileNode {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: FileNode[];
}

interface ComponentData {
  name: string;
  html: string;
  css: string;
  js: string;
  files?: FileNode[]; // New field for multi-file support
}

interface ChatState {
  messages: Message[];
  componentData: ComponentData | null;
  activeChatId: string | null;
  savedChatId: string | null;
  isPublic: boolean;
  loading: boolean;
  mode: "prompt" | "screenshot" | "research";
  generationMode: "standard" | "reverse";
  projectType: "component" | "app" | "game" | "auto";
  styleMode: "vanilla" | "tailwind";
  isListening: boolean;
  transcript: string;
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
  generationMode: "standard",
  projectType: "auto",
  styleMode: "vanilla",
  isListening: false,
  transcript: "",
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
    setMode(state, action: PayloadAction<"prompt" | "screenshot" | "research">) {
      state.mode = action.payload;
    },
    setGenerationMode(state, action: PayloadAction<"standard" | "reverse">) {
      state.generationMode = action.payload;
    },
    setProjectType(state, action: PayloadAction<"component" | "app" | "game" | "auto">) {
      state.projectType = action.payload;
    },
    setStyleMode(state, action: PayloadAction<"vanilla" | "tailwind">) {
      state.styleMode = action.payload;
    },
    setIsListening(state, action: PayloadAction<boolean>) {
      state.isListening = action.payload;
      if (!action.payload) {
        state.transcript = ""; // Reset transcript when stopping
      }
    },
    setTranscript(state, action: PayloadAction<string>) {
      state.transcript = action.payload;
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
      state.generationMode = "standard";
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
  setGenerationMode,
  setProjectType,
  setStyleMode,
  setIsListening,
  setTranscript,
  setError,
  setSidebarCollapsed,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
