import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Lock, Fingerprint, BadgeCheck } from 'lucide-react'
import { useAuthStore } from '../store'

const DEMO_ACCOUNTS = [
  { label: 'Registration Officer', email: 'officer@tripnest.gh', password: 'officer123' },
  { label: 'Super Admin', email: 'admin@tripnest.gh', password: 'admin123' },
  { label: 'Verification Officer', email: 'verify@tripnest.gh', password: 'verify123' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 600))
    const ok = login(email, password)
    if (ok) navigate('/dashboard')
    else setError('Invalid email or password.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-navy-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative w-full max-w-4xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <Shield size={20} />
            </div>
            <div>
              <p className="font-bold text-lg leading-none tracking-tight">TRIPNEST <span className="text-blue-400">ID</span></p>
              <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest">Registration Authority</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              Ghana's digital<br />identity, <span className="text-blue-400">secured.</span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Issue, verify and manage citizen ID cards from a single trusted portal.
            </p>
            <div className="flex gap-5 mt-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><Lock size={13} className="text-blue-400" /> Secure</span>
              <span className="flex items-center gap-1.5"><BadgeCheck size={13} className="text-blue-400" /> Trusted</span>
              <span className="flex items-center gap-1.5"><Fingerprint size={13} className="text-blue-400" /> Verified</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs font-semibold text-white mb-2.5">Demo accounts — click to fill</p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.password); setError('') }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="text-xs text-slate-300">{acc.label}</span>
                  <span className="text-[10px] font-mono text-slate-500">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-1 mb-8">Only authorized officers can access this portal.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="officer@tripnest.gh"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded accent-blue-600" />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-8">
            Protected system. Unauthorized access is prohibited and logged.
          </p>
        </div>
      </div>
    </div>
  )
}
