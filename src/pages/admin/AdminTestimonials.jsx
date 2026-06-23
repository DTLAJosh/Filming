import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'

const EMPTY = { quote: '', person_name: '', title: '', company_or_production: '', image_url: '', is_featured: false, is_public: true }

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [k]: val }))
  }

  const openNew = () => { setEditing('new'); setForm(EMPTY) }
  const openEdit = (t) => { setEditing(t.id); setForm(t) }
  const cancel = () => { setEditing(null) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    if (editing === 'new') {
      await supabase.from('testimonials').insert(form)
    } else {
      await supabase.from('testimonials').update(form).eq('id', editing)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const deleteT = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    load()
  }

  const toggle = async (t, key) => {
    await supabase.from('testimonials').update({ [key]: !t[key] }).eq('id', t.id)
    load()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-ed-black">Testimonials</h1>
          <button onClick={openNew} className="btn-primary text-xs">+ Add Testimonial</button>
        </div>

        {editing && (
          <form onSubmit={save} className="bg-white border border-ed-cream p-6 mb-8 space-y-4">
            <h2 className="font-display text-2xl">{editing === 'new' ? 'New Testimonial' : 'Edit Testimonial'}</h2>
            <div>
              <label className="form-label">Quote *</label>
              <textarea className="form-input min-h-[80px]" required value={form.quote} onChange={set('quote')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name *</label>
                <input className="form-input" required value={form.person_name} onChange={set('person_name')} />
              </div>
              <div>
                <label className="form-label">Title/Role</label>
                <input className="form-input" value={form.title} onChange={set('title')} placeholder="Location Manager" />
              </div>
              <div>
                <label className="form-label">Company / Production</label>
                <input className="form-input" value={form.company_or_production} onChange={set('company_or_production')} />
              </div>
              <div>
                <label className="form-label">Photo URL (optional)</label>
                <input className="form-input" value={form.image_url} onChange={set('image_url')} placeholder="https://…" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={set('is_featured')} className="w-4 h-4 accent-ed-gold" />
                <label htmlFor="is_featured" className="font-body text-sm text-ed-mid cursor-pointer">Featured on homepage</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_public" checked={form.is_public} onChange={set('is_public')} className="w-4 h-4 accent-ed-gold" />
                <label htmlFor="is_public" className="font-body text-sm text-ed-mid cursor-pointer">Publicly visible</label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-xs">{saving ? 'Saving…' : 'Save'}</button>
              <button type="button" onClick={cancel} className="btn-ghost-dark text-xs">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-ed-cream animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white border border-ed-cream p-5 flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-display text-base">{t.person_name}</span>
                    {t.title && <span className="font-body text-xs text-ed-stone">{t.title}</span>}
                    {t.is_featured && <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-ed-gold/10 text-ed-gold-dk">Featured</span>}
                    {!t.is_public && <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-amber-100 text-amber-700">Hidden</span>}
                  </div>
                  <p className="font-body text-xs text-ed-stone italic line-clamp-2">"{t.quote}"</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(t)} className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-ed-stone/30 text-ed-mid hover:border-ed-gold/50 transition-colors">Edit</button>
                  <button onClick={() => toggle(t, 'is_featured')} className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-ed-gold/30 text-ed-gold-dk hover:bg-ed-gold/10 transition-colors">
                    {t.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button onClick={() => toggle(t, 'is_public')} className={`font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border transition-colors ${t.is_public ? 'border-amber-300 text-amber-700' : 'border-emerald-300 text-emerald-700'}`}>
                    {t.is_public ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => deleteT(t.id)} className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-12 border border-dashed border-ed-stone/30">
                <p className="font-display text-2xl text-ed-mid">No testimonials yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
