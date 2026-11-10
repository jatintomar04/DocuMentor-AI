'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, FileText, Lock, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '@/store/features/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'
import { toast } from 'sonner'
import Footer from '@/components/Footer'


export default function SignIn() {

   const dispatch = useDispatch <AppDispatch>()
    const router = useRouter()
  const {user,loading, iserror} = useSelector((state:RootState)=>state.auth)

 const[formData, setFormData]= useState({
  email : "",
  password : ""
 })


  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange  = (event: ChangeEvent<HTMLInputElement>)=>{
          const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
     dispatch(loginThunk(formData))
   
  }

  useEffect(()=>{
    if(user){
      router.replace("/dashboard")
    }
      if(iserror){
    toast.error(iserror)
  }

  },[user, router,iserror])
  

  if(loading){
    return <Loader/>
  }

  return (

    <main className='min-h-screen  bg-[#fbfcff]  text-[#10172b] selection:bg-[#cdd8ff]'>
          <header className="flex items-center justify-between bg-transparent px-4 py-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
                <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-[-.04em]" aria-label="DocuMentor AI home">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#182342] text-white shadow-lg shadow-[#182342]/10"><FileText className="size-4" /></span>
                  <span className="text-lg">Docu<span className="text-[#536ef1]">Mentor</span> <span className="text-xs font-bold uppercase tracking-[.12em] text-[#8790a6]">AI</span></span>
                </Link>
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[#68728a] transition hover:text-[#10172b]"><ArrowLeft className="size-4" /> Back home</Link>
              </header>
      
    
    <div className="grid min-h-screen place-items-center ">
   
      <div className="w-full max-w-md">
       
        <div className="rounded-[1.75rem] border border-[#dfe5f1] bg-white p-7 shadow-[0_30px_80px_-45px_#526df0] sm:p-9">
          <h1 className="text-3xl font-semibold tracking-[-.05em]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#68728a]">Sign in to continue to your documents.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#35405c]">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8992a7]" />
                <input
                  id="email"
                  type="email"
                  name = "email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com"
                  className="w-full rounded-xl border border-[#dce2ee] bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#a3abbd] focus:border-[#526df0] focus:ring-4 focus:ring-[#526df0]/15"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#35405c]">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-[#526df0] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8992a7]" />
                <input
                  id="password"
                  name = "password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#dce2ee] bg-white py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-[#a3abbd] focus:border-[#526df0] focus:ring-4 focus:ring-[#526df0]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8992a7] hover:text-[#10172b]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#526df0] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#526df0]/20 transition hover:-translate-y-0.5 hover:bg-[#405be0]"
            >
              Sign in <ArrowRight className="size-4" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[#68728a]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-[#526df0] hover:underline">
            Dont have an account
          </Link>
        </p>
      </div>
    </div>
    <Footer />
    </main>
  )
}