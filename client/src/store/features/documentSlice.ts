

import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import { getMyDocuments } from "@/service/documentService";
import { uploadDocument } from "@/service/uploadDocument";

export interface DocumentItem {
  _id: string;
  title: string;
  publicId: string;
  status?: string;
  createdAt?: string;
}

interface DocumentState {
  documents: DocumentItem[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
  uploadSuccess: boolean;
}

const initialState: DocumentState = {
  documents: [],
  loading: false,
  uploading: false,
  error: null,
  uploadSuccess: false,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      message?: unknown;
      response?: { data?: { message?: unknown } };
    };
    const responseMessage = candidate.response?.data?.message;
    if (typeof responseMessage === "string") return responseMessage;
    if (typeof candidate.message === "string") return candidate.message;
  }
  return fallback;
}

// GET /api/documents
export const fetchDocuments = createAsyncThunk<
  DocumentItem[],
  void,
  { rejectValue: string }
>(
  "documents/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getMyDocuments();

      // Adjust this according to your backend response.
      return Array.isArray(result)
        ? result
        : result.documents ?? result.data ?? [];
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch documents"));
    }
  }
);

// Signature + Cloudinary upload + confirmation
export const uploadDocumentThunk = createAsyncThunk<
  DocumentItem,
  File,
  { rejectValue: string }
>(
  "documents/uploadDocument",
  async (file, { rejectWithValue }) => {
    try {
      return await uploadDocument(file);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Upload failed"));
    }
  }
);

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    clearDocumentError(state) {
      state.error = null;
    },

    resetUploadSuccess(state) {
      state.uploadSuccess = false;
    },

    setDocuments(state, action: PayloadAction<DocumentItem[]>) {
      state.documents = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch documents";
      })

      // Upload document
      .addCase(uploadDocumentThunk.pending, (state) => {
        state.uploading = true;
        state.uploadSuccess = false;
        state.error = null;
      })
      .addCase(uploadDocumentThunk.fulfilled, (state) => {
        state.uploading = false;
        state.uploadSuccess = true;
      })
      .addCase(uploadDocumentThunk.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload ?? "Upload failed";
      });
  },
});

export const {
  clearDocumentError,
  resetUploadSuccess,
  setDocuments,
} = documentSlice.actions;

export default documentSlice.reducer;
