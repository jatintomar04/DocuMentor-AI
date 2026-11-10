'use client'

import { FileText, LayoutDashboard, Settings, FolderOpen } from 'lucide-react'

export default function Loader() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#10172b]" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-[#e4e8f1] bg-white p-5 lg:flex">
          <div className="flex items-center gap-2.5 font-semibold tracking-[-.04em]">
            <span className="grid size-9 place-items-center rounded-xl bg-[#182342] text-white"><FileText className="size-4" /></span>
            <span className="text-lg">Docu<span className="text-[#536ef1]">Mentor</span> <span className="text-xs font-bold uppercase tracking-[.12em] text-[#8790a6]">AI</span></span>
          </div>
          <div className="mt-10 h-11 animate-pulse rounded-xl bg-[#e9edfa]" />
          <nav className="mt-8 space-y-3" aria-label="Loading navigation">
            {[LayoutDashboard, FolderOpen, Settings].map((Icon, index) => (
              <div key={index} className="flex items-center gap-3 rounded-xl px-3.5 py-3">
                <Icon className="size-4 text-[#cbd2e2]" />
                <span className="h-4 w-24 animate-pulse rounded bg-[#edf0f6]" />
              </div>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-3 border-t border-[#edf0f6] pt-5">
            <span className="size-9 animate-pulse rounded-full bg-[#e4e9fa]" />
            <span className="h-4 w-28 animate-pulse rounded bg-[#edf0f6]" />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-[#e4e8f1] bg-white px-5 sm:px-8">
            <div><div className="h-3 w-20 animate-pulse rounded bg-[#e0e6fa]" /><div className="mt-3 h-6 w-52 animate-pulse rounded bg-[#e8ebf3]" /></div>
            <span className="size-9 animate-pulse rounded-full bg-[#e4e9fa]" />
          </header>
          <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">
            <div><div className="h-9 w-80 animate-pulse rounded-lg bg-[#e1e6f0]" /><div className="mt-3 h-4 w-72 animate-pulse rounded bg-[#edf0f6]" /></div>
            <div className="grid gap-5 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl border border-[#e1e6f0] bg-white" />)}</div>
            <div className="grid gap-6 xl:grid-cols-[.82fr_1.55fr]">
              <div className="h-[430px] animate-pulse rounded-2xl border border-[#e1e6f0] bg-white" />
              <div className="h-[430px] animate-pulse rounded-2xl border border-[#e1e6f0] bg-white" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
