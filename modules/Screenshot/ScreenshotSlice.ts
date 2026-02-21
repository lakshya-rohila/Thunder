import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { analyzeScreenshot } from "./ScreenshotActions";

interface ScreenshotState {
  file: File | null;
  preview: string | null;
  isAnalyzing: boolean;
  analyzed: boolean;
  error: string | null;
  result: {
    name: string;
    html: string;
    css: string;
    js: string;
  } | null;
}

const initialState: ScreenshotState = {
  file: null,
  preview: null,
  isAnalyzing: false,
  analyzed: false,
  error: null,
  result: null,
};

const screenshotSlice = createSlice({
  name: "screenshot",
  initialState,
  reducers: {
    setFile(state, action: PayloadAction<File | null>) {
      state.file = action.payload;
    },
    setPreview(state, action: PayloadAction<string | null>) {
      state.preview = action.payload;
    },
    clearScreenshot(state) {
      state.file = null;
      state.preview = null;
      state.analyzed = false;
      state.result = null;
      state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeScreenshot.pending, (state) => {
        state.isAnalyzing = true;
        state.error = null;
        state.analyzed = false;
        state.result = null;
      })
      .addCase(analyzeScreenshot.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.analyzed = true;
        state.result = action.payload;
      })
      .addCase(analyzeScreenshot.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFile, setPreview, clearScreenshot, setError } = screenshotSlice.actions;
export default screenshotSlice.reducer;
