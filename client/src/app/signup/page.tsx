'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, FileText, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store";
import { registerThunk } from '@/store/features/authSlice'
import Loader from '@/components/Loader'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import AuthRedirect from '@/components/AuthRedirect'

export default function SignInPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, iserror } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value

    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(registerThunk(formData))
  }
  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
    if (iserror) {
      toast.error(iserror)
    }

  }, [iserror, user, router])

  if (loading) {
    return <Loader />
  }

  return (
    <AuthRedirect>
      <main className="min-h-screen bg-[#f5f7fc] text-[#10172b]">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-[-.04em]" aria-label="DocuMentor AI home">
              <span className="grid size-9 place-items-center rounded-xl bg-[#182342] text-white shadow-lg shadow-[#182342]/10"><FileText className="size-4" /></span>
              <span className="text-lg">Docu<span className="text-[#536ef1]">Mentor</span> <span className="text-xs font-bold uppercase tracking-[.12em] text-[#8790a6]">AI</span></span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[#68728a] transition hover:text-[#10172b]"><ArrowLeft className="size-4" /> Back home</Link>
          </header>

          <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_460px] lg:gap-24">
            <section className="hidden lg:block">
              <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#526df0]">Welcome </p>
              <h1 className="max-w-xl text-6xl font-semibold leading-[1.02] tracking-[-.07em]">Make every document feel <span className="bg-gradient-to-r from-[#526df0] to-[#8d6cf5] bg-clip-text text-transparent">simple.</span></h1>
              <p className="mt-7 max-w-md text-lg leading-8 text-[#68728a]">Sign up to keep asking better questions, finding key details, and turning long documents into clear answers.</p>
              <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#68728a]"><span className="rounded-full border border-[#dce2ee] bg-white px-4 py-2">Ask anything</span><span className="rounded-full border border-[#dce2ee] bg-white px-4 py-2">Understand faster</span><span className="rounded-full border border-[#dce2ee] bg-white px-4 py-2">Stay focused</span></div>
            </section>

            <section className="rounded-[2rem] border border-[#e0e5f0] bg-white p-6 shadow-[0_30px_90px_-45px_#526df0] sm:p-9">
              <div className="mb-8"><p className="text-2xl font-semibold tracking-[-.04em]">Sign up to DocuMentor</p><p className="mt-2 text-sm text-[#8992a7]">Enter your details to continue your workspace.</p></div>
              <div role="status" className="mb-5 rounded-xl border border-[#bde8d2] bg-[#effbf5] px-4 py-3 text-sm text-[#27784d]">Thanks. Your sign-up details are ready to be connected.</div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Field label="Full name
              " type="text"
                  name="name"
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<UserRound className="size-4" />} />
                <Field name="email" label="Email address" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} icon={<Mail className="size-4" />} />
                <Field name="phone" label="Phone number" type="tel" placeholder="+1 555 000 0000" value={formData.phone} onChange={handleChange} icon={<Phone className="size-4" />} />
                <Field name="password" label="Password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} icon={<LockKeyhole className="size-4" />} />
                <button type="submit" className="mt-3 w-full rounded-xl bg-[#526df0] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#526df0]/20 transition hover:-translate-y-0.5 hover:bg-[#405be0]">Continue <ArrowRight className="ml-2 inline size-4" /></button>
              </form>
              <p className="mt-7 text-center text-sm text-[#8992a7]">All ready have an account? <Link href="/signin" className="font-semibold text-[#526df0] hover:underline">Sign-in </Link></p>
            </section>
          </div>

        </div>
        <Footer />
      </main>
    </AuthRedirect>

  )
}

function Field({
  label,
  name,
  type,
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#35405c]">
        {label}
      </span>

      <span className="flex items-center gap-3 rounded-xl border border-[#dfe5f1] bg-[#fbfcff] px-3.5 transition focus-within:border-[#526df0] focus-within:ring-4 focus-within:ring-[#526df0]/10">
        <span className="text-[#8992a7]">{icon}</span>

        <input
          required
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#10172b] outline-none placeholder:text-[#a4adbd]"
        />
      </span>
    </label>
  );
}
