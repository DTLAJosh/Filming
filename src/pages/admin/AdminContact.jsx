import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'

export default function AdminContact() {
  const [contact, setContact] = useState(null)
  const [form, setForm] = useState({
    contact_name: '', title: '', email: '', phone: '',
    preferred_contact_method: 'Email', building_address: '', notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('building_contact').select('*').limit(1).single()
      .then(({ data }) => {
        if (data) {
          setContact(data)
          setForm(data)
        }
      })
  }, [])

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    if (contact) {
      await supabase.from('building_contact').update(payload).eq('id', contact.id)
    } else {
      const { data } = await supabase.from('building_contact').insert(payload).select().single()
      setContact(data)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-ed-black">Building Contact</h1>
          {saved && <span className="font-body text-xs text-emerald-600 uppercase tracking-widest">Saved ✓</span>}
        </div>

        <form onSubmit={save} className="bg-white border border-ed-cream p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Contact Name</label>
              <input className="form-input" value={form.contact_name || ''} onChange={set('contact_name')} />
            </div>
            <div>
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title || ''} onChange={set('title')} placeholder="Filming Coordinator" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email || ''} onChange={set('email')} />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input" value={form.phone || ''} onChange={set('phone')} />
            </div>
            <div>
              <label className="form-label">Preferred Contact Method</label>
              <select className="form-input" value={form.preferred_contact_method || 'Email'} onChange={set('preferred_contact_method')}>
                <option>Email</option>
                <option>Phone</option>
                <option>Text</option>
              </select>
            </div>
            <div>
              <label className="form-label">Building Address</label>
              <input className="form-input" value={form.building_address || ''} onChange={set('building_address')} />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Notes (shown on contact page)</label>
              <textarea className="form-input min-h-[80px] resize-y" value={form.notes || ''} onChange={set('notes')} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-xs">
            {saving ? 'Saving…' : 'Save Contact Info'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
