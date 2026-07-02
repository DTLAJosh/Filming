import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'
import { DEFAULT_GUIDELINES_MARKDOWN, DEFAULT_GUIDELINES_TITLE } from '../../data/guidelines'

export default function AdminGuidelines() {
  const { user } = useAuth()
  const contentRef = useRef(null)
  const [guideline, setGuideline] = useState(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState(DEFAULT_GUIDELINES_TITLE)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('filming_guidelines').select('*').order('created_at').limit(1).single()
      .then(({ data }) => {
        if (data) {
          setGuideline(data)
          setContent(data.content || DEFAULT_GUIDELINES_MARKDOWN)
          setTitle(data.title || DEFAULT_GUIDELINES_TITLE)
        } else {
          setContent(DEFAULT_GUIDELINES_MARKDOWN)
          setTitle(DEFAULT_GUIDELINES_TITLE)
        }
      })
  }, [])

  useLayoutEffect(() => {
    if (!contentRef.current) return

    contentRef.current.style.height = 'auto'
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`
  }, [content])

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

        <div className="space-y-5 max-w-6xl">
          <div>
            <label className="form-label">Page Title</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between gap-4 mb-1.5">
              <label className="form-label mb-0">Content (Markdown supported)</label>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Replace the editor content with the full default guidelines copy?')) {
                    setTitle(DEFAULT_GUIDELINES_TITLE)
                    setContent(DEFAULT_GUIDELINES_MARKDOWN)
                  }
                }}
                className="font-body text-[10px] uppercase tracking-widest text-ed-gold hover:underline"
              >
                Restore full default copy
              </button>
            </div>
            <textarea
              ref={contentRef}
              className="form-input min-h-[max(640px,calc(100vh-260px))] resize-y overflow-hidden font-mono text-sm leading-6"
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
