'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
  Trash
} from 'lucide-react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { useSyncExternalStore } from "react";
import { fetchDocuments, removeDocumentThunk, uploadDocumentThunk } from '@/store/features/documentSlice'
import { askQuestion as askQuestionThunk } from '@/store/features/chatSlice'
import PdfPreview from "@/components/PDFpreview";
import { logout } from '@/store/features/authSlice'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'



const suggestions = [
  'Summarize this document',
  'What are the key findings?',
  'Explain this in simple terms',
]

export default function DashboardPage() {

  const subscribe = () => () => { };
  const getClientSnapshot = () => true;
  const getServerSnapshot = () => false;
  const { user } = useSelector((state: RootState) => state.auth)
  const { documents } = useSelector((state: RootState) => state.documents)
  const { messages, loading } = useSelector((state: RootState) => state.chat);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [uploaded, setUploaded] = useState<File | null>(null);
  const [question, setQuestion] = useState('')
  const [sent, setSent] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
 const chooseFile = (file?: File) => {
  if (!file) return;

  setUploaded(file);

  requestAnimationFrame(() => {
    uploadSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
};
  // const askQuestion = (value = question) => {
  //   if (!value.trim()) return
  //   setQuestion(value)
  //   setSent(true)
  // }

  const handleUpload = async () => {
    if (!uploaded) {
      alert("Please select a PDF file first");
      return;
    }

    try {
      await dispatch(uploadDocumentThunk(uploaded)).unwrap();

      setUploaded(null);

      // Refresh documents after successful upload
      await dispatch(fetchDocuments()).unwrap();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleAsk = (
    documentId: string | null,
    questionText: string
  ) => {
    if (!documentId) {
      alert("Please select a document first")
      return
    }

    if (!questionText.trim()) return

    dispatch(
      askQuestionThunk({
        documentId,
        question: questionText.trim(),
      })
    )
  }

  const questionsAsked = messages.filter(
    (message) => message.role === "user"
  ).length;

  const timeSaved = (questionsAsked * 3 / 60).toFixed(1);



  useEffect(() => {
    dispatch(fetchDocuments())
  }, [dispatch])


  useEffect(() => {
    const chatBox = chatContainerRef.current;

    if (chatBox) {
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleRemoveDocument = async (documentid: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this document?"
  );

  if (!confirmDelete) return;

  try {
    await dispatch(removeDocumentThunk(documentid)).unwrap();

    if (activeDocumentId === documentid) {
      setActiveDocumentId(null);
    }
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
  

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/signin");
  };


  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#10172b]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-[#e4e8f1] bg-white p-5 transition-transform lg:static lg:translate-x-0`}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold tracking-[-.04em]"
              aria-label="DocuMentor AI home"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[#182342] text-white">
                <FileText className="size-4" />
              </span>
              <span className="text-lg">
                Docu<span className="text-[#536ef1]">Mentor</span>{' '}
                <span className="text-xs font-bold uppercase tracking-[.12em] text-[#8790a6]">
                  AI
                </span>
              </span>
            </Link>
            <button
              className="rounded-lg p-2 text-[#8992a7] lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className="mt-10 flex items-center justify-center gap-2 rounded-xl bg-[#526df0] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#526df0]/20 transition hover:bg-[#405be0]"
          >
            <Plus className="size-4" /> New document
          </button>

          <nav className="mt-8 space-y-1" aria-label="Dashboard navigation">
            <a
              href="#dashboard"
              className="flex items-center gap-3 rounded-xl bg-[#eef1ff] px-3.5 py-3 text-sm font-semibold text-[#526df0]"
            >
              <LayoutDashboard className="size-4" /> Overview
            </a>
            <a
              href="#documents"
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#68728a] hover:bg-[#f7f8fc] hover:text-[#10172b]"
            >
              <FolderOpen className="size-4" /> My documents
            </a>

          </nav>

          <div className="mt-auto border-t border-[#edf0f6] pt-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-[#dfe5ff] text-sm font-bold text-[#526df0]">
                {user?.name.split(" ").map((word) => word[0].toLocaleUpperCase()).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-[#8992a7]">
                  {user?.email}
                </p>
              </div>
              <button onClick={handleLogout}
                aria-label="Log out"
                className="text-[#8992a7] hover:text-[#10172b]"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <button
            className="fixed inset-0 z-40 bg-[#10172b]/20 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
        )}

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-[#e4e8f1] bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-[#68728a] lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#526df0]">
                  Workspace
                </p>
                <h1 className="text-xl font-semibold tracking-[-.04em]" suppressHydrationWarning>
                  Welcome,{" "}
                  {mounted && user?.name
                    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                    : "Guest"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                aria-label="Notifications"
                className="rounded-xl border border-[#e4e8f1] p-2.5 text-[#68728a] hover:bg-[#f7f8fc]"
              >
                <Bell className="size-4" />
              </button>
              <span className="hidden size-9 items-center justify-center rounded-full bg-[#dfe5ff] text-sm font-bold text-[#526df0] sm:flex">
                {user?.name.split(" ").map((word) => word[0].toLocaleUpperCase()).join("")}
              </span>
            </div>
          </header>

          <div
            id="dashboard"
            className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10"
          >
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-semibold tracking-[-.06em]">
                  Your document workspace
                </h2>
                <p className="mt-2 text-sm text-[#8992a7]">
                  Pick up where you left off or start a new conversation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#182342] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#293a76]"
              >
                <Upload className="size-4" />
                Choose document
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Stat
                label="Documents uploaded"
                value={String(documents.length)}
                detail="2 added this week"
              />
              <Stat
                label="Questions asked"
                value={String(questionsAsked)}
                detail="18% more than last week"
              />
              <Stat
                label="Time saved"
                value={`${timeSaved}h`}
                detail="Based on your activity"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[.82fr_1.55fr]">
              {/* Document List */}
              <section
                id="documents"
                className="rounded-2xl border border-[#e1e6f0] bg-white p-5"
              >
                <div className="mb-5 flex justify-between ">
                  <div>
                    <h2 className="font-semibold">Your documents</h2>
                    <p className="mt-1 text-xs text-[#8992a7]">
                      3 of 12 recently used
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Search documents"
                    onClick={() => setShowSearch((prev) => !prev)}
                    className="rounded-lg p-2 text-[#8992a7] hover:bg-[#f7f8fc]"
                  >
                    <Search className="size-4" />
                  </button>
                  {showSearch && (
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#526df0]"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => {
                      const isActive = activeDocumentId === doc._id;

                      return (
                       <div
  key={doc._id}
  onClick={() => setActiveDocumentId(doc._id)}
  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition cursor-pointer ${
    isActive ? "bg-[#eef1ff]" : "hover:bg-[#f7f8fc]"
  }`}
>
  <span
    className={`grid size-10 place-items-center rounded-lg ${
      isActive
        ? "bg-white text-[#526df0]"
        : "bg-[#f1f3f8] text-[#8992a7]"
    }`}
  >
    <FileText className="size-4" />
  </span>

  <span className="min-w-0 flex-1">
    <span
      className={`block truncate text-sm font-medium ${
        isActive ? "text-[#526df0]" : ""
      }`}
    >
      {doc.title}
    </span>

    <span className="mt-1 block text-xs text-[#8992a7]">
      Uploaded at:{" "}
      {doc.createdAt
        ? new Date(doc.createdAt).toLocaleString()
        : "Unknown date"}
    </span>
  </span>

  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      handleRemoveDocument(doc._id);
    }}
    className="rounded-lg p-2 transition hover:bg-red-50"
    title="Delete document"
  >
    <Trash className="size-4 text-[#aab2c2] hover:text-red-500" />
  </button>
</div>
                        
                      );
                    })
                  ) : (
                    <p className="py-6 text-center text-sm text-gray-400">
                      {searchQuery ? "No matching documents found." : "No documents uploaded yet."}
                    </p>
                  )}
                </div>
                <button className="mt-5 w-full rounded-xl border border-dashed border-[#cbd4ed] py-3 text-sm font-medium text-[#526df0] hover:bg-[#f7f8fc]">
                  View all documents
                </button>
              </section>

              {/* Chat Interface */}
              <section className="overflow-hidden rounded-2xl border border-[#e1e6f0] bg-white">
                <div className="flex items-center justify-between border-b border-[#edf0f6] px-5 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="size-2 rounded-full bg-[#4fc38b]" />{' '}
                    Research paper.pdf
                  </div>
                  <button
                    className="rounded-lg p-2 text-[#8992a7] hover:bg-[#f7f8fc]"
                    aria-label="More document options"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
                <div className="grid min-h-[390px] lg:grid-cols-[1fr_1.05fr]">
                  {/* Chat Box */}

                  <div className="border-b border-[#edf0f6] p-6 lg:border-b-0 lg:border-r">
                    <p className="mb-5 text-xs font-bold uppercase tracking-[.16em] text-[#8992a7]">
                      Ask your document
                    </p>

                    {/* Chat messages */}
                    <div
                      ref={chatContainerRef}
                      className="max-h-[450px] space-y-3 overflow-y-auto"
                    >
                      {messages?.length > 0 ? (
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`rounded-xl p-4 text-sm leading-6 ${message.role === "user"
                              ? "ml-5 bg-[#f2f4ff] text-[#35405c]"
                              : "mr-2 bg-[#182342] text-white/85"
                              }`}
                          >
                            {message.role === "assistant" && (
                              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#aebdff]">
                                <Sparkles className="size-3.5" />
                                DocuMentor AI
                              </div>
                            )}

                            {message.role === "user" && (
                              <p className="mb-2 font-semibold text-[#526df0]">
                                You asked
                              </p>
                            )}

                            <p className="whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl bg-[#182342] p-4 text-sm leading-6 text-white/85">
                          <Sparkles className="mb-2 size-3.5 text-[#aebdff]" />
                          Ask a question to start exploring the content of this document.
                        </div>
                      )}

                      {/* LOADER HERE */}
                      {loading && (
                        <div className="mr-2 rounded-xl bg-[#182342] p-4">
                          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#aebdff]">
                            <Sparkles className="size-3.5" />
                            DocuMentor AI
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="size-2 animate-bounce rounded-full bg-[#aebdff]" />
                              <span className="size-2 animate-bounce rounded-full bg-[#aebdff] [animation-delay:150ms]" />
                              <span className="size-2 animate-bounce rounded-full bg-[#aebdff] [animation-delay:300ms]" />
                            </div>
                            <span className="text-xs text-white/60">
                              Analyzing your document...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    <div className="mt-7 flex flex-wrap gap-2">
                      {suggestions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleAsk(activeDocumentId, item)}
                          className="rounded-full border border-[#dfe5f1] px-3 py-2 text-xs text-[#68728a] hover:border-[#526df0] hover:text-[#526df0]"
                        >
                          {item}
                        </button>
                      ))}


                    </div>

                    {/* Question input */}
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();

                        handleAsk(activeDocumentId, question);

                        setQuestion("");
                      }}
                      className="mt-6 flex items-center gap-2 rounded-xl border border-[#dfe5f1] bg-[#fbfcff] p-2 focus-within:border-[#526df0] focus-within:ring-4 focus-within:ring-[#526df0]/10"
                    >
                      <input
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                        placeholder="Ask anything about this document..."
                        className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#a4adbd]"
                        aria-label="Ask a question"
                      />

                      <button
                        type="submit"
                        disabled={!question.trim()}
                        className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#526df0] text-white hover:bg-[#405be0] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Send question"
                      >
                        <MessageCircle className="size-4" />
                      </button>
                    </form>
                  </div>


                  {/* Document Preview */}
                  <div className="bg-[#fbfcff] p-6">
                    <p className="mb-5 text-xs font-bold uppercase tracking-[.16em] text-[#8992a7]">
                      Document preview
                    </p>

                    {(() => {
                      const selectedDocument = documents?.find(
                        (doc) => String(doc._id) === activeDocumentId
                      );

                      return selectedDocument ? (
                        <div className="overflow-hidden rounded-xl border border-[#e4e8f1] bg-white shadow-sm">

                          {/* Header */}
                          <div className="flex items-center gap-2 border-b border-[#e4e8f1] p-5">
                            <FileText className="size-4 shrink-0 text-[#526df0]" />

                            <span className="truncate text-sm font-semibold">
                              {selectedDocument.title}
                            </span>
                          </div>

                          {/* PDF Preview */}
                          <div className="bg-gray-100 p-3">
                            <PdfPreview
                              documentId={String(selectedDocument._id)}
                              token={(user as { token?: string } | null)?.token || ""}
                            />
                          </div>

                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-[#e4e8f1] bg-white p-10 text-center">
                          <FileText className="mx-auto mb-3 size-8 text-[#8992a7]" />

                          <p className="text-sm font-medium text-gray-600">
                            No document selected
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Select a document to preview it.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </section>
            </div>

            {/* Bottom Upload Section */}
            <section ref={uploadSectionRef} className="rounded-2xl bg-gradient-to-r from-[#182342] to-[#31468b] p-6 text-white sm:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#b8c4ff]">
                    <Sparkles className="size-4" /> Make your next document
                    easier
                  </div>
                  <h2 className="text-2xl font-semibold tracking-[-.04em]">
                    Upload a file and start asking.
                  </h2>
                  <p className="mt-2 max-w-lg text-sm text-white/65">
                    Get clear, context-aware answers without digging through
                    every page yourself.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#182342] hover:bg-[#eef1ff]">
                  <Upload className="size-4" /> Choose file
                  <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(event) => chooseFile(event.target.files?.[0])}
                  />
                </label>
              </div>

              {uploaded && (
                <div className="mt-5 flex flex-col gap-4 rounded-xl border border-white/20 bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-white/15">
                      <FileText className="size-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Document selected
                      </p>
                      <p className="truncate text-xs text-white/70">
                        {uploaded.name}
                      </p>
                      <p className="mt-1 text-xs text-[#b8c4ff]">
                        Ready to upload
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setUploaded(null)}
                      className="rounded-lg border border-white/30 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#182342] hover:bg-[#eef1ff] disabled:opacity-50"
                    >
                      <Upload className="size-4" />
                      Upload PDF
                    </button>
                  </div>

                </div>
              )}

            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-[#e1e6f0] bg-white p-5">
      <p className="text-sm text-[#8992a7]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-.06em]">{value}</p>
      <p className="mt-2 text-xs font-medium text-[#4fae7d]">{detail}</p>
    </div>
  )
}