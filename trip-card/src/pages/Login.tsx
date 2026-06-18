import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store'

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
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0F1C3F 0%, #1E3A8A 100%)' }}>
      {/* Left panel */}
      <div className="flex-1 flex items-center justify-center px-12">
        <div className="text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TRIPNEST <span className="text-blue-300">ID</span></h1>
              <p className="text-blue-200 text-sm">Registration Authority</p>
            </div>
          </div>
          <p className="text-blue-100 text-lg font-light leading-relaxed">
            Secure · Trusted · Verified
          </p>
          <p className="text-blue-300 text-sm mt-4">
            Ghana's national digital identity management system for issuing and verifying citizen IDs.
          </p>

          {/* Demo hints */}
          <div className="mt-8 p-4 bg-white/10 rounded-xl text-xs text-blue-200 space-y-1">
            <p className="font-semibold text-white mb-2">Demo Credentials</p>
            <p>officer@tripnest.gh / officer123</p>
            <p>admin@tripnest.gh / admin123</p>
            <p>verify@tripnest.gh / verify123</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[420px] bg-white flex items-center justify-center p-10">
        <div className="w-full">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Login to Your Account</h2>
          <p className="text-slate-500 text-sm mb-8">Only authorized officers can access this portal.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <button type="button" className="text-sm text-blue-600 hover:underline">Forgot password?</button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
