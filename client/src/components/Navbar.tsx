"use client";

import { logout } from "@/store/features/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import {
  ArrowRight,
  FileText,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Render auth-dependent UI only after client mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e9f2]/80 bg-[#fbfcff]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-[-.04em]"
          aria-label="DocuMentor AI home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#182342] text-white shadow-lg shadow-[#182342]/10">
            <FileText className="size-4" />
          </span>

          <span className="text-lg">
            Docu<span className="text-[#536ef1]">Mentor</span>{" "}
            <span className="text-xs font-bold uppercase tracking-[.12em] text-[#8790a6]">
              AI
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-[#68728a] md:flex">
          <a href="#features" className="hover:text-[#10172b]">
            Features
          </a>

          <a href="#how-it-works" className="hover:text-[#10172b]">
            How it works
          </a>

          <a href="#use-cases" className="hover:text-[#10172b]">
            Use cases
          </a>

          <a href="#faq" className="hover:text-[#10172b]">
            FAQ
          </a>

          {!mounted ? (
            <div className="h-10 w-36" />
          ) : user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-red-500 px-4 py-2.5 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-400"
            >
              Logout <LogOut className="ml-1 inline size-3.5" />
            </button>
          ) : (
            <>
              <Link
                href="/signin"
                className="ml-2 hover:text-[#10172b]"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-[#526df0] px-4 py-2.5 text-white shadow-lg shadow-[#526df0]/20 transition hover:-translate-y-0.5 hover:bg-[#405be0]"
              >
                Get started free{" "}
                <ArrowRight className="ml-1 inline size-3.5" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mx-5 mb-4 flex flex-col gap-4 rounded-2xl border border-[#e5e9f2] bg-white p-5 text-sm shadow-xl md:hidden">
          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>

          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How it works
          </a>

          <a href="#use-cases" onClick={() => setMenuOpen(false)}>
            Use cases
          </a>

          <a href="#faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </a>

          {!mounted ? (
            <div className="h-10 w-full" />
          ) : user ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="rounded-full bg-red-500 px-4 py-3 text-center text-white"
            >
              Logout <LogOut className="ml-1 inline size-3.5" />
            </button>
          ) : (
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#526df0] px-4 py-3 text-center text-white"
            >
              Get started free
            </Link>
          )}
        </div>
      )}
    </header>
  );
}