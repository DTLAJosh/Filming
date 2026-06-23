import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'

const EMPTY = { title: '', description: '', file_url: '', category: 'General', is_public: true, last_updated: new Date().toISOString().split('T')[0] }

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('documents').select('*').order('category').order('title')
    setDocuments(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [k]: val }))
  }

  const openNew = () => { setEditing('new'); setForm(EMPTY) }
  const openEdit = (doc) => { setEditing(doc.id); setForm(doc) }
  const cancel = () => { setEditing(null); setForm(EMPTY) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    if (editing === 'new') {
      await supabase.from('documents').insert(form)
    } else {
      await supabase.from('documents').update(form).eq('id', editing)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const deleteDoc = async (id) => {
    if (!confirm('Delete this document?')) return
    await supabase.from('documents').delete().eq('id', id)
    load()
  }

  const togglePublic = async (doc) => {
    await supabase.from('documents').update({ is_public: !doc.is_public }).eq('id', doc.id)
    load()
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-ed-black">Documents</h1>
          <button onClick={openNew} className="btn-primary text-xs">+ Add Document</button>
        </div>

        {/* Form */}
        {editing && (
          <form onSubmit={save} className="bg-white border border-ed-cream p-6 mb-8 space-y-4">
            <h2 className="font-display text-2xl">{editing === 'new' ? 'New Document' : 'Edit Document'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" required value={form.title} onChange={set('title')} />
              </div>
              <div>
                <label className="form-label">Category</label>
                <input className="form-input" value={form.category} onChange={set('category')} placeholder="e.g. Insurance, Templates" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={set('description')} />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">File URL</label>
                <input className="form-input" value={form.file_url} onChange={set('file_url')} placeholder="https://…" />
              </div>
              <div>
                <label className="form-label">Last Updated</label>
                <input type="date" className="form-input" value={form.last_updated} onChange={set('last_updated')} />
              </div>
              <div className="flex items-center gap-3 pt-6">
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

        {/* List */}
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-ed-cream animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white border border-ed-cream p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-display text-lg">{doc.title}</h3>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ed-stone px-2 py-0.5 bg-ed-cream">{doc.category}</span>
                    {!doc.is_public && <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-amber-100 text-amber-700">Hidden</span>}
                  </div>
                  {doc.description && <p className="font-body text-xs text-ed-stone">{doc.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(doc)} className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-ed-stone/30 text-ed-mid hover:border-ed-gold/50 transition-colors">Edit</button>
                  <button onClick={() => togglePublic(doc)} className={`font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border transition-colors ${doc.is_public ? 'border-amber-300 text-amber-700' : 'border-emerald-300 text-emerald-700'}`}>
                    {doc.is_public ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => deleteDoc(doc.id)} className="font-body text-[10px] uppercase tracking-widest py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <div className="text-center py-12 border border-dashed border-ed-stone/30">
                <p className="font-display text-2xl text-ed-mid">No documents yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
