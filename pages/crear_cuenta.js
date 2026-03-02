import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function CrearCuenta() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
    }
  }

  return (
    <>
      <Head>
        <title>FinanceApp - Create Account</title>
      </Head>

      <div className="flex min-h-screen flex-col lg:flex-row font-display bg-background-light text-slate-900">
        {/* Branding Side */}
        <div className="relative hidden w-full items-center justify-center bg-primary lg:flex lg:w-1/2 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          ></div>
          <div className="relative z-10 p-12 text-white max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white">
                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">FinanceApp</h2>
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight mb-6">Join FinanceApp</h1>
            <p className="text-xl font-normal text-blue-100 mb-8">
              Manage your future today with our intelligent wealth management tools. Secure, transparent, and built for your growth.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <span className="material-symbols-outlined text-blue-200">security</span>
                <h3 className="font-bold">Secure Assets</h3>
                <p className="text-sm text-blue-100/80">Bank-grade encryption for all your data.</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="material-symbols-outlined text-blue-200">monitoring</span>
                <h3 className="font-bold">Real-time Data</h3>
                <p className="text-sm text-blue-100/80">Instant insights on your portfolio performance.</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
        </div>

        {/* Form Side */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-24 bg-white">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-2 lg:hidden">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
              <span className="text-xl font-bold tracking-tight">FinanceApp</span>
            </div>
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
              <p className="mt-2 text-slate-500">Fill in your details to get started with your journey.</p>
            </div>
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="username">Username</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">Email</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="rounded-xl border border-dashed border-slate-300 p-6 bg-slate-50/50">
                <div className="mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">mark_email_read</span>
                  <span className="text-sm font-bold text-slate-700">Email Verification</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Enter the 6-digit code we sent to your email after clicking sign up.</p>
                <div className="flex gap-2">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      className="w-full h-12 text-center rounded-lg border border-slate-200 bg-white text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      maxLength={1}
                      type="text"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              <button
                className="w-full rounded-lg bg-primary py-4 text-center text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 transition-all"
                type="submit"
              >
                Create Account
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link className="font-bold text-primary hover:underline" href="/login">Login</Link>
              </p>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
