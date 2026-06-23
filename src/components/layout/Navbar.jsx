import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { to: '/units', label: 'Available Units' },
    { to: '/guidelines', label: 'Guidelines' },
    { to: '/documents', label: 'Documents' },
    { to: '/testimonials', label: 'Kind Words' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-ed-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex flex-col leading-none">
            <span className="font-display text-ed-gold text-lg md:text-xl font-light tracking-widest uppercase">
              The El Dorado Lofts
            </span>
            <span className="font-mono text-ed-stone text-[9px] tracking-widest2 uppercase mt-0.5">
              Film Locations
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-body text-xs uppercase tracking-widest transition-colors ${
                    isActive ? 'text-ed-gold' : 'text-ed-cream/80 hover:text-ed-gold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Auth links */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-ed-stone/30">
              {user ? (
                <>
                  {isAdmin && (
                    <NavLink to="/admin" className="font-body text-xs uppercase tracking-widest text-ed-gold/70 hover:text-ed-gold transition-colors">
                      Admin
                    </NavLink>
                  )}
                  <NavLink to="/dashboard" className="font-body text-xs uppercase tracking-widest text-ed-cream/80 hover:text-ed-gold transition-colors">
                    Portal
                  </NavLink>
                  <button onClick={handleSignOut} className="font-body text-xs uppercase tracking-widest text-ed-stone hover:text-ed-cream transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-ghost text-xs py-2 px-4">
                  Homeowner Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-ed-cream transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-6 h-px bg-ed-cream transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-ed-cream transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-ed-black border-t border-ed-charcoal">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-body text-sm uppercase tracking-widest py-1 transition-colors ${
                    isActive ? 'text-ed-gold' : 'text-ed-cream/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="border-t border-ed-charcoal pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <NavLink to="/admin" onClick={() => setOpen(false)} className="font-body text-sm uppercase tracking-widest text-ed-gold/70">Admin</NavLink>
                  )}
                  <NavLink to="/dashboard" onClick={() => setOpen(false)} className="font-body text-sm uppercase tracking-widest text-ed-cream/80">Homeowner Portal</NavLink>
                  <button onClick={handleSignOut} className="font-body text-sm uppercase tracking-widest text-ed-stone text-left">Sign Out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost text-xs py-2 px-4 w-fit">
                  Homeowner Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
