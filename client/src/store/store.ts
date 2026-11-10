
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/features/authSlice";
import documentReducer from "@/store/features/documentSlice";
import chatReducer from "@/store/features/chatSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentReducer,
    chat : chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
