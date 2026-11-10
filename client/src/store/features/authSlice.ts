
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  registerUser,
  loginUser,
  type AuthResponse,
  type RegisterPayload,
  type LoginPayload,
} from "@/service/authService";


export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  iserror: string | null;
  message: string | null
};

const initialState: AuthState = {
  user:  null,
  token: null,
  isAuthenticated: false,
  loading: false,
  message: null,
  iserror: null,
};

// REGISTER THUNK
export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, thunkAPI) => {
  console.log(payload);
  try {
    return await registerUser(payload);
  } catch (error : unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message
      : error instanceof Error
        ? error.message
        : "Registration failed";
    return thunkAPI.rejectWithValue(message)
  }
});

// LOGIN THUNK
export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, thunkAPI) => {
  try {
    return await loginUser(payload);
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message
      : error instanceof Error
        ? error.message
        : "Login failed";
    return thunkAPI.rejectWithValue(message)
  }
});

// AUTH SLICE
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.iserror = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.iserror = null;
      localStorage.removeItem("user")
    },

    clearAuthError: (state) => {
      state.iserror = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.iserror = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.iserror = action.payload ?? null;
      })

      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.iserror = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.iserror = action.payload ?? null;
      });
  },
});

export const { setCredentials, logout, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;
