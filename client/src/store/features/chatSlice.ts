
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { askQuestionApi } from "@/service/chatService";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  documentId: string | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

interface AskQuestionArgs {
  documentId: string;
  question: string;
  token?: string;
}

const initialState: ChatState = {
  documentId: null,
  messages: [],
  loading: false,
  error: null,
};

export const askQuestion = createAsyncThunk<
  { question: string; answer: string },
  AskQuestionArgs,
  { rejectValue: string }
>(
  "chat/askQuestion",
  async ({ documentId, question }, { rejectWithValue }) => {
    console.log(documentId,question);
    try {
      const result = await askQuestionApi(
        { documentId, question },
      );

      return { question, answer: result.answer };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatDocument(state, action: PayloadAction<string>) {
      if (state.documentId !== action.payload) {
        state.documentId = action.payload;
        state.messages = [];
        state.error = null;
      }
    },

    clearChat(state) {
      state.messages = [];
      state.error = null;
      state.loading = false;
    },

    clearChatError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askQuestion.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        state.messages.push({
          id: `${Date.now()}-user`,
          role: "user",
          content: action.meta.arg.question,
        });
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        state.loading = false;

        state.messages.push({
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: action.payload.answer,
        });
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to get answer";
      });
  },
});

export const { setChatDocument, clearChat, clearChatError } =
  chatSlice.actions;

export default chatSlice.reducer;
