import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignupPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: 'homeowner',
      })
      if (profileError) {
        setError('Account created but profile setup failed. Please contact support.')
        setLoading(false)
        return
      }
    }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-ed-dark flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex flex-col items-center mb-10">
          <span className="font-display text-ed-gold text-2xl tracking-widest uppercase">El Dorado Lofts</span>
          <span className="font-mono text-ed-stone text-[9px] tracking-widest2 uppercase mt-1">Film Locations</span>
        </Link>

        <div className="bg-ed-black p-8 border border-ed-charcoal">
          <h1 className="font-display text-2xl text-ed-cream mb-1">Create Account</h1>
          <p className="font-body text-xs text-ed-stone mb-8">List your El Dorado unit as a film location.</p>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 mb-6 font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="form-label text-ed-stone">Full Name</label>
              <input
                required
                className="form-input bg-ed-charcoal border-ed-charcoal text-ed-cream placeholder:text-ed-stone/40 focus:border-ed-gold"
                value={form.full_name}
                onChange={set('full_name')}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="form-label text-ed-stone">Email</label>
              <input
                type="email"
                required
                className="form-input bg-ed-charcoal border-ed-charcoal text-ed-cream placeholder:text-ed-stone/40 focus:border-ed-gold"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="form-label text-ed-stone">Phone</label>
              <input
                type="tel"
                className="form-input bg-ed-charcoal border-ed-charcoal text-ed-cream placeholder:text-ed-stone/40 focus:border-ed-gold"
                value={form.phone}
                onChange={set('phone')}
                placeholder="(213) 555-0100"
              />
            </div>
            <div>
              <label className="form-label text-ed-stone">Password</label>
              <input
                type="password"
                required
                minLength={8}
                className="form-input bg-ed-charcoal border-ed-charcoal text-ed-cream placeholder:text-ed-stone/40 focus:border-ed-gold"
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="font-body text-xs text-ed-stone text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ed-gold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="font-body text-xs text-ed-stone/40 text-center mt-6">
          <Link to="/" className="hover:text-ed-stone transition-colors">← Back to public site</Link>
        </p>
      </div>
    </div>
  )
}
