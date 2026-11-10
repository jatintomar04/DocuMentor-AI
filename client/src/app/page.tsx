'use client'

import { useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Lightbulb,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const faqs = [
  [
    'What is DocuMentor AI?',
    'DocuMentor AI is a document assistant that helps you understand uploaded files by answering questions grounded in their content.',
  ],
  [
    'How do I ask questions about a PDF?',
    'Upload a document, then ask naturally in the conversation panel. Try a summary, a definition, or a question about a specific section.',
  ],
  [
    'Does it support large documents?',
    'DocuMentor is designed to help with long documents, though the supported size depends on your eventual plan and setup.',
  ],
  [
    'Are answers based on my uploaded document?',
    'The product experience is designed to retrieve relevant passages from your document before answering. Always review important information against the source.',
  ],
  [
    'Do I need technical knowledge to use it?',
    'No. If you can ask a question, you can use DocuMentor.',
  ],
]

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const selectFile = (file?: File) => file && setFileName(file.name)
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcff] text-[#10172b] selection:bg-[#cdd8ff]">
       <Navbar />
      <section
        id="top"
        className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-28"
      >
        <div className="absolute left-1/2 top-0 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-[#e3e9ff] opacity-60 blur-3xl" />
        <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <div className=" mb-7 inline-flex items-center gap-2 rounded-full border border-[#c7ccdf] bg-white px-3.5 py-2 text-xs font-semibold text-[#526df0] shadow-sm">
              <Sparkles className="size-3.5" /> Your documents, understood by AI
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-.07em] sm:text-7xl">
              Turn your PDFs{' '}
             <span className="-mx-[0.08em] bg-gradient-to-r from-[#526df0] to-[#8d6cf5] bg-clip-text px-[0.08em] pb-[0.12em] text-transparent [box-decoration-break:clone]">
                into conversations.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#68728a]">
              Upload your documents, ask questions in plain English, and get answers grounded in
              your own content. Less searching, more understanding.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-[#526df0] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#526df0]/20 transition hover:-translate-y-0.5 hover:bg-[#405be0]"
              >
                Start asking for free <ArrowRight className="ml-2 inline size-4" />
              </Link>
              <a
                href="#how-it-works"
                className="rounded-full border border-[#dce2ee] bg-white px-6 py-3.5 text-sm font-semibold text-[#35405c] hover:border-[#526df0]"
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 text-sm text-[#8992a7]">
              Upload a PDF. Ask anything. Understand faster.
            </p>
          </div>
          <ProductMockup fileName={fileName} inputRef={inputRef} selectFile={selectFile} />
        </div>
      </section>

      <section className="border-y border-[#e5e9f2] bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {[
            'Understand documents faster',
            'Ask questions naturally',
            'Get context-aware answers',
            'Keep your workflow simple',
          ].map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-3 border-b border-[#edf0f6] py-5 text-sm font-medium text-[#68728a] last:border-0 sm:px-5 sm:nth-[2]:border-b-0 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-0"
            >
              <span className="grid size-7 place-items-center rounded-full bg-[#eef1ff] text-[#526df0]">
                <Check className="size-3.5" />
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#526df0]">
            Powerful, without the complexity
          </p>
          <h2 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">
            Everything you need to understand your documents
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              'Smart PDF understanding',
              'Extract meaningful information from uploaded documents and make lengthy content easier to understand.',
              FileText,
            ],
            [
              'Ask questions naturally',
              'Ask questions in everyday language and get answers relevant to your document.',
              MessageCircle,
            ],
            [
              'Context-aware AI answers',
              'Get responses grounded in the content retrieved from your document.',
              Search,
            ],
            [
              'Simple document workflow',
              'Upload a document, start a conversation, and focus on what matters.',
              Zap,
            ],
          ].map(([title, text, Icon]) => (
            <div
              key={title as string}
              className="group rounded-2xl border border-[#e5e9f2] bg-white p-6 shadow-[0_10px_35px_-28px_#526df0] transition hover:-translate-y-1 hover:border-[#cdd7ff] hover:shadow-xl"
            >
              <span className="mb-12 grid size-11 place-items-center rounded-xl bg-[#eef1ff] text-[#526df0] transition group-hover:bg-[#526df0] group-hover:text-white">
                {Icon && <Icon className="size-5" />}
              </span>
              <h3 className="font-semibold">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-[#68728a]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-[#f1f4fb] px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#526df0]">
              How it works
            </p>
            <h2 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">
              From PDF to insights in three simple steps
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                '01',
                'Upload your document',
                'Upload your PDF securely through the document upload workflow.',
                Upload,
              ],
              [
                '02',
                'Let AI understand the content',
                'The system extracts document text and prepares relevant content for retrieval.',
                Lightbulb,
              ],
              [
                '03',
                'Ask and explore',
                'Ask questions and receive answers based on relevant document content.',
                MessageCircle,
              ],
            ].map(([number, title, text, Icon]) => (
              <div
                key={number as string}
                className="relative rounded-2xl border border-[#dde3f0] bg-white p-7"
              >
                <span className="text-xs font-bold tracking-[.2em] text-[#9aa4b9]">
                  {number as string}
                </span>
                <span className="my-8 grid size-12 place-items-center rounded-xl bg-[#eef1ff] text-[#526df0]">
                  {Icon && <Icon className="size-5" />}
                </span>
                <h3 className="text-lg font-semibold">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-[#68728a]">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#dfe5f1] bg-white p-4 shadow-[0_30px_80px_-45px_#526df0] sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-[#edf0f6] pb-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="size-2 rounded-full bg-[#4fc38b]" /> Document workspace
            </div>
            <span className="text-xs text-[#8a94aa]">Visual preview</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-[.7fr_1.2fr_1fr]">
            <div className="rounded-xl bg-[#f7f8fc] p-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-[.14em] text-[#8a94aa]">
                Your documents
              </p>
              {['Research paper.pdf', 'Project brief.pdf', 'Meeting notes.docx'].map((x, i) => (
                <div
                  key={x}
                  className={`mb-2 flex items-center gap-2 rounded-lg p-3 text-xs ${i === 0 ? 'bg-white font-semibold text-[#526df0] shadow-sm' : 'text-[#68728a]'}`}
                >
                  <FileText className="size-4" />
                  {x}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-[#edf0f6] p-5">
              <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-[#526df0]" /> Research paper.pdf
              </div>
              <div className="space-y-3 text-xs leading-5 text-[#8992a7]">
                <div className="h-2 w-4/5 rounded bg-[#e9edf5]" />
                <div className="h-2 w-full rounded bg-[#e9edf5]" />
                <div className="h-2 w-11/12 rounded bg-[#e9edf5]" />
                <div className="mt-5 h-2 w-3/4 rounded bg-[#e9edf5]" />
                <div className="h-2 w-full rounded bg-[#e9edf5]" />
                <div className="rounded-lg border-l-2 border-[#8d6cf5] bg-[#f3f0ff] p-3 text-[#68728a]">
                  The study indicates a meaningful relationship between the two variables across the
                  sample.
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#182342] p-5 text-white">
              <div className="mb-7 flex items-center gap-2 text-sm font-semibold">
                <span className="grid size-6 place-items-center rounded-md bg-[#526df0]">
                  <Sparkles className="size-3" />
                </span>{' '}
                Ask your document
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-xs leading-5 text-white/80">
                What are the key findings in this document?
              </div>
              <div className="mt-4 rounded-xl bg-[#526df0] p-4 text-xs leading-5 text-white">
                <p className="mb-2 font-semibold">Here&apos;s what stood out:</p>
                <ul className="space-y-1.5 text-white/80">
                  <li>• The primary relationship was consistent.</li>
                  <li>• Results suggest a practical implication.</li>
                  <li>• More research is recommended.</li>
                </ul>
                <p className="mt-3 text-[10px] text-white/60">Source: pages 4–6</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="use-cases"
        className="border-y border-[#e5e9f2] bg-white px-5 py-24 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#526df0]">
                Use cases
              </p>
              <h2 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">
                Built for the way you work
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#68728a]">
              One simple conversation layer for the documents that shape your day.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Students', 'Understand notes, study material, and research papers.', BookOpen],
              ['Developers', 'Explore technical documentation and project PDFs.', Zap],
              ['Researchers', 'Review papers and find relevant information.', Search],
              [
                'Professionals',
                'Extract insights from reports and business documents.',
                ShieldCheck,
              ],
            ].map(([title, text, Icon]) => (
              <div key={title as string} className="rounded-2xl border border-[#e5e9f2] p-6">
                <Icon className="size-5 text-[#526df0]" />
                <h3 className="mt-8 font-semibold">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-[#68728a]">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#526df0]">FAQ</p>
          <h2 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">
            Good questions deserve clear answers.
          </h2>
        </div>
        {faqs.map(([q, a], i) => (
          <div key={q} className="border-t border-[#e5e9f2]">
            <button
              className="flex w-full items-center justify-between gap-4 py-6 text-left font-semibold"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
            >
              {q}
              <ChevronDown
                className={`size-5 shrink-0 text-[#526df0] transition ${openFaq === i ? 'rotate-180' : ''}`}
              />
            </button>
            {openFaq === i && (
              <p className="-mt-2 max-w-2xl pb-6 pr-8 text-sm leading-6 text-[#68728a]">{a}</p>
            )}
          </div>
        ))}
      </section>

      <section className="mx-5 mb-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#182342] to-[#293a76] px-6 py-16 text-center text-white sm:mx-8 lg:mx-auto lg:max-w-7xl">
        <Sparkles className="mx-auto mb-5 size-6 text-[#aebdff]" />
        <h2 className="text-4xl font-semibold tracking-[-.06em] sm:text-5xl">
          Your next document could be easier to understand.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-white/65">
          Spend less time searching through pages and more time discovering what matters.
        </p>
        <a
          href="/signup"
          className="mt-8 inline-block rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#182342] transition hover:-translate-y-0.5 hover:bg-[#eef1ff]"
        >
          Get started free <ArrowRight className="ml-2 inline size-4" />
        </a>
      </section>
      <Footer />
    </main>
  )
}

function ProductMockup({
  fileName,
  inputRef,
  selectFile,
}: {
  fileName: string
  inputRef: React.RefObject<HTMLInputElement | null>
  selectFile: (file?: File) => void
}) {
  return (
    <div id="upload" className="relative">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[#dfe6ff] blur-3xl" />
      <div className="rounded-[1.75rem] border border-[#dfe5f1] bg-white p-3 shadow-[0_30px_80px_-35px_#526df0]">
        <div className="rounded-[1.25rem] bg-[#f5f7fc] p-5 sm:p-7">
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="size-2 rounded-full bg-[#4fc38b]" /> New conversation
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs text-[#8992a7]">
              Document ready
            </span>
          </div>
          <div
            className="rounded-2xl border-2 border-dashed border-[#bfcaff] bg-white px-5 py-10 text-center transition hover:border-[#526df0]"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              selectFile(e.dataTransfer.files[0])
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') inputRef.current?.click()
            }}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />
            <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[#eef1ff] text-[#526df0]">
              <Upload className="size-6" />
            </span>
            <p className="font-semibold">{fileName || 'Drop a document here'}</p>
            <p className="mt-2 text-sm text-[#8992a7]">or click to browse · PDF, DOCX, TXT</p>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm">
            <MessageCircle className="size-4 text-[#526df0]" />
            <span className="flex-1 text-[#8992a7]">
              Try asking: <em className="text-[#35405c]">“Summarize this document”</em>
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-xl border border-[#e5e9f2] bg-white px-4 py-3 shadow-xl sm:flex">
        <span className="grid size-8 place-items-center rounded-lg bg-[#eef1ff] text-[#526df0]">
          <ShieldCheck className="size-4" />
        </span>
        <div>
          <p className="text-xs font-semibold">Grounded answers</p>
          <p className="text-[11px] text-[#8992a7]">With source context</p>
        </div>
      </div>
    </div>
  )
}