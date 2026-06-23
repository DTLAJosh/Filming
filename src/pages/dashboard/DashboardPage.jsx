import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import FurnishingBadge from '../../components/ui/FurnishingBadge'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=60'

const STATUS_BADGE = {
  published: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-stone-100 text-stone-600',
  unpublished: 'bg-amber-100 text-amber-800',
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  const loadUnits = async () => {
    const { data } = await supabase
      .from('units')
      .select('*, unit_photos(image_url, sort_order)')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    setUnits(data || [])
    setLoading(false)
  }

  useEffect(() => { loadUnits() }, [user])

  const togglePublish = async (unit) => {
    const newStatus = unit.status === 'published' ? 'unpublished' : 'published'
    await supabase.from('units').update({ status: newStatus }).eq('id', unit.id)
    loadUnits()
  }

  const deleteUnit = async (id) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    await supabase.from('units').delete().eq('id', id)
    loadUnits()
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ed-stone mb-1">Homeowner Portal</p>
            <h1 className="font-display text-4xl text-ed-black">
              Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
            </h1>
          </div>
          <Link to="/dashboard/units/new" className="btn-primary text-xs">
            + Add Unit
          </Link>
        </div>

        {/* Units */}
        <div>
          <h2 className="font-display text-2xl text-ed-black mb-6">Your Listings</h2>

          {loading ? (
            <div className="space-y-4">
              {[1,2].map(i => <div key={i} className="h-28 bg-ed-cream animate-pulse" />)}
            </div>
          ) : units.length === 0 ? (
            <div className="border border-dashed border-ed-stone/40 p-12 text-center">
              <p className="font-display text-2xl text-ed-mid mb-2">No listings yet</p>
              <p className="font-body text-sm text-ed-stone mb-6">Create your first unit listing to start appearing on the public site.</p>
              <Link to="/dashboard/units/new" className="btn-primary text-xs">
                Add Your First Unit
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {units.map(unit => {
                const photo = unit.unit_photos?.sort((a,b) => a.sort_order - b.sort_order)?.[0]?.image_url || PLACEHOLDER
                return (
                  <div key={unit.id} className="bg-white border border-ed-cream p-5 flex gap-5 items-start">
                    {/* Thumbnail */}
                    <div className="shrink-0 w-24 h-18 overflow-hidden bg-ed-cream">
                      <img src={photo} alt="" className="w-24 h-18 object-cover aspect-square" onError={e => { e.target.src = PLACEHOLDER }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 flex-wrap mb-1">
                        <h3 className="font-display text-xl text-ed-black">{unit.title}</h3>
                        <span className={`text-[10px] font-body uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_BADGE[unit.status] || STATUS_BADGE.draft}`}>
                          {unit.status}
                        </span>
                        {unit.admin_hidden && (
                          <span className="text-[10px] font-body uppercase tracking-widest px-2 py-0.5 bg-red-100 text-red-700 rounded">
                            Hidden by Admin
                          </span>
                        )}
                      </div>
                      <FurnishingBadge status={unit.furnishing_status} />
                      {unit.square_feet && (
                        <span className="font-mono text-[10px] text-ed-stone uppercase tracking-widest ml-3">
                          {unit.square_feet.toLocaleString()} sq ft
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex flex-col gap-2">
                      <Link to={`/dashboard/units/${unit.id}/edit`} className="btn-ghost-dark text-[10px] py-1.5 px-3">
                        Edit
                      </Link>
                      <a href={`/units/${unit.id}`} target="_blank" rel="noopener noreferrer" className="text-center font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-ed-stone/30 text-ed-stone hover:text-ed-mid transition-colors">
                        Preview
                      </a>
                      <button
                        onClick={() => togglePublish(unit)}
                        className={`font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border transition-colors ${
                          unit.status === 'published'
                            ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                            : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {unit.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteUnit(unit.id)}
                        className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-12 bg-ed-cream p-6 border border-ed-stone/20">
          <p className="eyebrow mb-4">Quick Reference</p>
          <div className="flex flex-wrap gap-4">
            <a href="/guidelines" target="_blank" className="font-body text-xs text-ed-mid hover:text-ed-gold transition-colors underline underline-offset-2">
              Filming Guidelines
            </a>
            <a href="/documents" target="_blank" className="font-body text-xs text-ed-mid hover:text-ed-gold transition-colors underline underline-offset-2">
              Documents
            </a>
            <a href="/contact" target="_blank" className="font-body text-xs text-ed-mid hover:text-ed-gold transition-colors underline underline-offset-2">
              Building Contact
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
