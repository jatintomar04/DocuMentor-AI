"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAuthStatus";
import { setCredentials } from "@/store/features/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        dispatch(
          setCredentials({
            user: JSON.parse(storedUser),
            token: storedToken,
          })
        );
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [dispatch]);

  return null;
}