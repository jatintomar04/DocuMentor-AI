"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Loader from "@/components/Loader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if ( !user) {
      router.replace("/signin");
    }
  }, [ user, router]);

  if(loading){
    return <Loader />;
  }


  return <>{children}</>;
}