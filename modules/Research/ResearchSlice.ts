import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { performResearch } from "./ResearchActions";
import { ResearchResult } from "@/lib/research";

interface ResearchState {
  topic: string;
  result: ResearchResult | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ResearchState = {
  topic: "",
  result: null,
  isLoading: false,
  error: null,
};

const researchSlice = createSlice({
  name: "research",
  initialState,
  reducers: {
    setTopic(state, action: PayloadAction<string>) {
      state.topic = action.payload;
    },
    clearResult(state) {
      state.result = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performResearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(performResearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload as ResearchResult;
      })
      .addCase(performResearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTopic, clearResult, setError } = researchSlice.actions;
export default researchSlice.reducer;
