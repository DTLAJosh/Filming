import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const changeRole = async (id, role) => {
    await supabase.from('profiles').update({ role }).eq('id', id)
    load()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-display text-4xl text-ed-black mb-8">Users</h1>
        <p className="font-body text-sm text-ed-mid mb-6">
          Manage homeowner accounts and admin roles. Use caution when granting admin access.
        </p>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-ed-cream animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-white border border-ed-cream p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-lg">{u.full_name || '—'}</p>
                    <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 ${
                      u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                  <p className="font-body text-xs text-ed-stone">{u.email}</p>
                  {u.phone && <p className="font-body text-xs text-ed-stone">{u.phone}</p>}
                  <p className="font-mono text-[9px] text-ed-stone/50 uppercase tracking-widest mt-1">
                    Joined {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {u.role !== 'admin' ? (
                    <button
                      onClick={() => { if (confirm(`Grant admin role to ${u.full_name || u.email}?`)) changeRole(u.id, 'admin') }}
                      className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => { if (confirm(`Remove admin role from ${u.full_name || u.email}?`)) changeRole(u.id, 'homeowner') }}
                      className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      Remove Admin
                    </button>
                  )}
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center py-12 border border-dashed border-ed-stone/30">
                <p className="font-display text-2xl text-ed-mid">No users yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
