import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-ed-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-ed-charcoal rounded-lg p-8 space-y-6">
        <div className="text-center">
          <div className="font-display text-ed-gold text-2xl font-light tracking-widest uppercase mb-1">
            The El Dorado Lofts
          </div>
          <div className="font-mono text-[9px] tracking-widest2 uppercase text-ed-stone">
            Film Locations
          </div>
        </div>

        <h2 className="font-display text-2xl text-ed-cream font-light">Set New Password</h2>

        {done ? (
          <p className="text-green-400 text-sm text-center">
            Password updated! Redirecting to your dashboard…
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="eyebrow mb-2 block">New Password</label>
              <input
                type="password"
                required
                minLength={6}
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
              {loading ? 'Saving…' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
