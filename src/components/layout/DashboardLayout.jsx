import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

export default function DashboardLayout({ children }) {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ed-cream flex">
      {/* Sidebar */}
      <aside className="w-56 bg-ed-dark flex flex-col shrink-0">
        <div className="p-6 border-b border-ed-charcoal">
          <div className="font-display text-ed-gold text-base tracking-widest uppercase">El Dorado</div>
          <div className="font-mono text-[9px] text-ed-stone uppercase tracking-widest mt-0.5">Homeowner Portal</div>
        </div>

        {profile && (
          <div className="px-4 py-4 border-b border-ed-charcoal">
            <p className="font-body text-xs text-ed-stone">Signed in as</p>
            <p className="font-body text-sm text-ed-cream mt-0.5 truncate">{profile.full_name || profile.email}</p>
          </div>
        )}

        <nav className="flex-1 p-4">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `block px-3 py-2.5 font-body text-xs uppercase tracking-widest transition-colors rounded mb-0.5 ${
                isActive ? 'bg-ed-charcoal text-ed-gold' : 'text-ed-stone hover:text-ed-cream'
              }`
            }
          >
            My Units
          </NavLink>
          <NavLink
            to="/dashboard/units/new"
            className={({ isActive }) =>
              `block px-3 py-2.5 font-body text-xs uppercase tracking-widest transition-colors rounded mb-0.5 ${
                isActive ? 'bg-ed-charcoal text-ed-gold' : 'text-ed-stone hover:text-ed-cream'
              }`
            }
          >
            + Add Unit
          </NavLink>
        </nav>

        <div className="p-4 border-t border-ed-charcoal space-y-2">
          <NavLink to="/" className="block px-3 py-2 font-body text-xs uppercase tracking-widest text-ed-stone hover:text-ed-cream transition-colors">
            ← Public Site
          </NavLink>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-3 py-2 font-body text-xs uppercase tracking-widest text-ed-stone hover:text-ed-cream transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
