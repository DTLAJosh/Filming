import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

export default function AdminGuidelines() {
  const { user } = useAuth()
  const [guideline, setGuideline] = useState(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('Filming Guidelines')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('filming_guidelines').select('*').order('created_at').limit(1).single()
      .then(({ data }) => {
        if (data) {
          setGuideline(data)
          setContent(data.content || '')
          setTitle(data.title || 'Filming Guidelines')
        }
      })
  }, [])

  const save = async () => {
    setSaving(true)
    const payload = {
      title,
      content,
      last_updated: new Date().toISOString(),
      updated_by: user.id,
    }
    if (guideline) {
      await supabase.from('filming_guidelines').update(payload).eq('id', guideline.id)
    } else {
      const { data } = await supabase.from('filming_guidelines').insert(payload).select().single()
      setGuideline(data)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-ed-black">Filming Guidelines</h1>
          <div className="flex items-center gap-3">
            {saved && <span className="font-body text-xs text-emerald-600 uppercase tracking-widest">Saved ✓</span>}
            <button onClick={save} disabled={saving} className="btn-primary text-xs">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-5 max-w-3xl">
          <div>
            <label className="form-label">Page Title</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Content (Markdown supported)</label>
            <textarea
              className="form-input min-h-[600px] resize-y font-mono text-sm"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="## Building Approval Process&#10;&#10;All filming requires…"
            />
          </div>
          <p className="font-body text-xs text-ed-stone">
            Use Markdown formatting. Section headers with <code className="bg-ed-cream px-1">##</code>, bold with <code className="bg-ed-cream px-1">**text**</code>, and horizontal rules with <code className="bg-ed-cream px-1">---</code>.
          </p>
          <a href="/guidelines" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-ed-gold hover:underline">
            Preview public page →
          </a>
        </div>
      </div>
    </AdminLayout>
  )
}
