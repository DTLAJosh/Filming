import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import FurnishingBadge from '../../components/ui/FurnishingBadge'
import { supabase } from '../../lib/supabase'

export default function AdminUnits() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const { data } = await supabase
      .from('units')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
    setUnits(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleHidden = async (unit) => {
    await supabase.from('units').update({ admin_hidden: !unit.admin_hidden }).eq('id', unit.id)
    load()
  }

  const toggleFeatured = async (unit) => {
    await supabase.from('units').update({ is_featured: !unit.is_featured }).eq('id', unit.id)
    load()
  }

  const deleteUnit = async (id) => {
    if (!confirm('Permanently delete this unit listing?')) return
    await supabase.from('units').delete().eq('id', id)
    load()
  }

  const filtered = filter === 'all' ? units
    : filter === 'hidden' ? units.filter(u => u.admin_hidden)
    : filter === 'published' ? units.filter(u => u.status === 'published' && !u.admin_hidden)
    : units.filter(u => u.status === filter)

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-display text-4xl text-ed-black mb-8">All Unit Listings</h1>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'published', 'draft', 'unpublished', 'hidden'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 font-body text-xs uppercase tracking-widest border transition-all ${
                filter === f ? 'border-ed-gold bg-ed-gold/10 text-ed-gold-dk' : 'border-ed-stone/30 text-ed-mid hover:border-ed-gold/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-ed-cream animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(unit => (
              <div key={unit.id} className="bg-white border border-ed-cream p-5 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display text-lg text-ed-black">{unit.title}</h3>
                    <span className={`text-[10px] font-body uppercase tracking-widest px-2 py-0.5 ${
                      unit.status === 'published' ? 'bg-emerald-100 text-emerald-700'
                      : unit.status === 'draft' ? 'bg-stone-100 text-stone-600'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {unit.status}
                    </span>
                    {unit.admin_hidden && (
                      <span className="text-[10px] font-body uppercase tracking-widest px-2 py-0.5 bg-red-100 text-red-700">
                        Admin Hidden
                      </span>
                    )}
                    {unit.is_featured && (
                      <span className="text-[10px] font-body uppercase tracking-widest px-2 py-0.5 bg-ed-gold/10 text-ed-gold-dk">
                        Featured
                      </span>
                    )}
                  </div>
                  <FurnishingBadge status={unit.furnishing_status} />
                  <p className="font-body text-xs text-ed-stone mt-1">
                    Owner: {unit.profiles?.full_name || unit.profiles?.email || 'Unknown'}
                  </p>
                </div>

                <div className="shrink-0 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleHidden(unit)}
                    className={`font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border transition-colors ${
                      unit.admin_hidden
                        ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                        : 'border-red-300 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {unit.admin_hidden ? 'Unhide' : 'Hide'}
                  </button>
                  <button
                    onClick={() => toggleFeatured(unit)}
                    className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-ed-gold/30 text-ed-gold-dk hover:bg-ed-gold/10 transition-colors"
                  >
                    {unit.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <a
                    href={`/units/${unit.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-ed-stone/30 text-ed-stone hover:text-ed-mid transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteUnit(unit.id)}
                    className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 border border-dashed border-ed-stone/30">
                <p className="font-display text-2xl text-ed-mid">No units found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
