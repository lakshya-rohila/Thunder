import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateImage } from "./ImageGenerationActions";
import { IMAGE_MODELS } from "@/lib/image-gen";

interface ImageGenerationState {
  prompt: string;
  selectedModel: string;
  isGenerating: boolean;
  generatedImage: string | null;
  error: string | null;
}

const initialState: ImageGenerationState = {
  prompt: "",
  selectedModel: IMAGE_MODELS[0].id,
  isGenerating: false,
  generatedImage: null,
  error: null,
};

const imageGenerationSlice = createSlice({
  name: "imageGeneration",
  initialState,
  reducers: {
    setPrompt(state, action: PayloadAction<string>) {
      state.prompt = action.payload;
    },
    setSelectedModel(state, action: PayloadAction<string>) {
      state.selectedModel = action.payload;
    },
    clearImage(state) {
      state.generatedImage = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateImage.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
        state.generatedImage = null;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.generatedImage = action.payload as string;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPrompt, setSelectedModel, clearImage, setError } = imageGenerationSlice.actions;
export default imageGenerationSlice.reducer;
