import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-ed-dark flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center mb-10">
          <span className="font-display text-ed-gold text-2xl tracking-widest uppercase">El Dorado Lofts</span>
          <span className="font-mono text-ed-stone text-[9px] tracking-widest2 uppercase mt-1">Film Locations</span>
        </Link>

        <div className="bg-ed-black p-8 border border-ed-charcoal">
          <h1 className="font-display text-2xl text-ed-cream mb-1">Homeowner Login</h1>
          <p className="font-body text-xs text-ed-stone mb-8">Sign in to manage your film location listings.</p>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 mb-6 font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label text-ed-stone">Email</label>
              <input
                type="email"
                required
                className="form-input bg-ed-charcoal border-ed-charcoal text-ed-cream placeholder:text-ed-stone/40 focus:border-ed-gold"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="form-label text-ed-stone">Password</label>
              <input
                type="password"
                required
                className="form-input bg-ed-charcoal border-ed-charcoal text-ed-cream placeholder:text-ed-stone/40 focus:border-ed-gold"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="font-body text-xs text-ed-stone text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-ed-gold hover:underline">Create one</Link>
          </p>
        </div>

        <p className="font-body text-xs text-ed-stone/40 text-center mt-6">
          <Link to="/" className="hover:text-ed-stone transition-colors">← Back to public site</Link>
        </p>
      </div>
    </div>
  )
}
