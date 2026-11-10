
import type { ReactNode } from "react";
import ProtectedRoutes from "@/components/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProtectedRoutes>{children}</ProtectedRoutes>;
}
