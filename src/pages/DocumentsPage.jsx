import { useState, useEffect } from 'react'
import PublicLayout from '../components/layout/PublicLayout'
import { supabase } from '../lib/supabase'

const DOWNLOAD_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('documents')
      .select('*')
      .eq('is_public', true)
      .order('category')
      .then(({ data }) => {
        setDocuments(data || [])
        setLoading(false)
      })
  }, [])

  // Group by category
  const grouped = documents.reduce((acc, doc) => {
    const cat = doc.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(doc)
    return acc
  }, {})

  return (
    <PublicLayout>
      <div className="dark-section pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow mb-4">For Productions</p>
          <h1 className="font-display text-5xl md:text-6xl text-ed-cream font-light">Documents</h1>
          <p className="font-body text-ed-stone mt-4 max-w-xl">
            Download required filming documents, templates, and reference materials.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-ed-cream animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-20 border border-ed-cream">
            <p className="font-display text-3xl text-ed-mid mb-2">No documents yet</p>
            <p className="font-body text-sm text-ed-stone">Check back soon or contact the building manager.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, docs]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <p className="eyebrow">{category}</p>
                  <div className="flex-1 h-px bg-ed-stone/20" />
                </div>
                <div className="space-y-3">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-start justify-between gap-6 p-6 border border-ed-stone/20 hover:border-ed-gold/30 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl font-medium text-ed-black group-hover:text-ed-gold transition-colors">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="font-body text-sm text-ed-mid leading-relaxed mt-1">{doc.description}</p>
                        )}
                        {doc.last_updated && (
                          <p className="font-mono text-[9px] uppercase tracking-widest text-ed-stone/60 mt-2">
                            Updated {new Date(doc.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="shrink-0 flex items-center gap-2 btn-ghost-dark py-2 px-4 text-xs"
                        >
                          {DOWNLOAD_ICON}
                          Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact note */}
        <div className="mt-16 bg-ed-cream p-8 border border-ed-stone/20">
          <p className="eyebrow mb-3">Need Something Else?</p>
          <p className="font-body text-sm text-ed-mid leading-relaxed">
            If you need a document that isn't listed here, or have questions about filing requirements, 
            contact the building manager directly.
          </p>
          <a href="/contact" className="btn-ghost-dark mt-4 text-xs py-2 px-4 inline-flex">
            Building Contact Info →
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}
