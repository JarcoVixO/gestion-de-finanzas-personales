import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Head>
        <title>FinanceApp - Login</title>
      </Head>

      <div className="relative flex min-h-screen w-full flex-col lg:flex-row overflow-x-hidden bg-background-light font-display text-slate-900">
        {/* Left Side: Brand Illustration */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-24 bg-primary/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]"></div>
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-4xl font-bold">account_balance_wallet</span>
              <h2 className="text-2xl font-black tracking-tight">FinanceApp</h2>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight text-slate-900">
                Take Control of <br />Your <span className="text-primary">Wealth</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                FinanceApp helps you track, save, and invest with ease. Join over 1M+ users managing their future today.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-primary/10">
                <span className="material-symbols-outlined text-primary mb-3">trending_up</span>
                <h4 className="font-bold text-slate-900">Smart Tracking</h4>
                <p className="text-sm text-slate-500">Real-time insights on your spending habits.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-primary/10">
                <span className="material-symbols-outlined text-primary mb-3">shield</span>
                <h4 className="font-bold text-slate-900">Secure Data</h4>
                <p className="text-sm text-slate-500">Bank-grade encryption for all your assets.</p>
              </div>
            </div>
          </div>
          <div
            className="mt-12 rounded-2xl overflow-hidden aspect-video shadow-2xl border-4 border-white"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCdsVQWQqvvAeXq7waESUpSigS1u2VDwoM8xUk91u-qSjn1MZ1dtFM0qCT5DXblgZs_1Wwm4hn92MvBCuIV6y29xFr-tD2DpunKFNQJRNXRYAI4u788Jaqe-kiubAD6U7oFstc49hWifwGF33MD4gUBHl07eoqgwMndXuyft_PFPbKM63rmpfVMpksdgCYMZQgOHS6sASjWvpD7CbcrhWyjOwuDZcLLA2LCFmIXoJE9LkHxKw9Ze3VC3e59h05YxeOutzs46Cx_Gu6')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>

        {/* Right Side: Login Card */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Logo for Mobile */}
            <div className="flex lg:hidden items-center gap-2 text-primary mb-8 justify-center">
              <span className="material-symbols-outlined text-3xl font-bold">account_balance_wallet</span>
              <h2 className="text-xl font-bold tracking-tight">FinanceApp</h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8 overflow-hidden">
              <button className="flex-1 py-4 text-sm font-bold border-b-2 border-primary text-primary transition-all">
                Login
              </button>
              <Link
                href="/crear_cuenta"
                className="flex-1 py-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-all text-center"
              >
                Sign Up
              </Link>
            </div>

            {/* Form Section */}
            <form className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Username or Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-background-light text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="name@company.com"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                    <input
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 bg-background-light text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a className="text-sm font-medium text-primary hover:underline" href="#">Forgot Password?</a>
              </div>

              <button
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                type="submit"
              >
                Sign In
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            {/* Help Link */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">Need help? <a className="text-primary font-medium hover:underline" href="#">Contact Support</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
