import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createChat, generateComponent } from "./ChatActions";

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
  jsx?: string; // Add support for React JSX
  files?: FileNode[]; // New field for multi-file support
}

export interface ChatState {
  messages: Message[];
  componentData: ComponentData | null;
  activeChatId: string | null;
  savedChatId: string | null;
  isPublic: boolean;
  loading: boolean;
  mode: "prompt" | "screenshot" | "research" | "image" | "code";
  generationMode: "standard" | "reverse";
  projectType: "component" | "app" | "game" | "auto";
  styleMode: "vanilla" | "tailwind";
  framework: "html" | "react";
  isListening: boolean;
  transcript: string;
  error: string | null;
  sidebarCollapsed: boolean;
}

const initialState: ChatState = {
  framework: "react",
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
    setMode(
      state,
      action: PayloadAction<
        "prompt" | "screenshot" | "research" | "image" | "code"
      >,
    ) {
      state.mode = action.payload;
    },
    setGenerationMode(state, action: PayloadAction<"standard" | "reverse">) {
      state.generationMode = action.payload;
    },
    setProjectType(
      state,
      action: PayloadAction<"component" | "app" | "game" | "auto">,
    ) {
      state.projectType = action.payload;
    },
    setStyleMode(state, action: PayloadAction<"vanilla" | "tailwind">) {
      state.styleMode = action.payload;
    },
    setFramework(state, action: PayloadAction<"html" | "react">) {
      state.framework = action.payload;
    },
    setIsListening(state, action: PayloadAction<boolean>) {
      state.isListening = action.payload;
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
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChat.fulfilled, (state, action) => {
        state.savedChatId = action.payload;
      })
      .addCase(generateComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateComponent.fulfilled, (state, action) => {
        state.loading = false;
        // Data handling is typically done in the component via result,
        // but we can update state here if needed.
        // For now, we'll leave it to the component to dispatch setComponentData
        // or handle it here if we want to move logic out of the component completely.
      })
      .addCase(generateComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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
  setFramework,
  setIsListening,
  setTranscript,
  setError,
  setSidebarCollapsed,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
