import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateCode } from "./CodeAssistantActions";

interface CodeAssistantState {
  prompt: string;
  generatedCode: string;
  isLoading: boolean;
  error: string | null;
  language: string;
}

const initialState: CodeAssistantState = {
  prompt: "",
  generatedCode: "",
  isLoading: false,
  error: null,
  language: "javascript",
};

const codeAssistantSlice = createSlice({
  name: "codeAssistant",
  initialState,
  reducers: {
    setPrompt(state, action: PayloadAction<string>) {
      state.prompt = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    clearCode(state) {
      state.generatedCode = "";
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.generatedCode = "";
      })
      .addCase(generateCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedCode = action.payload as string;
      })
      .addCase(generateCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPrompt, setLanguage, clearCode, setError } = codeAssistantSlice.actions;
export default codeAssistantSlice.reducer;
