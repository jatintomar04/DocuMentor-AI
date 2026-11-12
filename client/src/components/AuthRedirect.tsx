"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Loader from "@/components/Loader";

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (  user) {
      router.replace("/dashboard");
    }
  }, [ user, router]);

  if (user) {
    return <Loader />;
  }

  return <>{children}</>;
}