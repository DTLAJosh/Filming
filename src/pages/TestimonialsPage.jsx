import { useState, useEffect } from 'react'
import PublicLayout from '../components/layout/PublicLayout'
import { supabase } from '../lib/supabase'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_public', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTestimonials(data || [])
        setLoading(false)
      })
  }, [])

  const featured = testimonials.filter(t => t.is_featured)
  const rest = testimonials.filter(t => !t.is_featured)

  return (
    <PublicLayout>
      <div className="dark-section pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow mb-4">From the Industry</p>
          <h1 className="font-display text-5xl md:text-6xl text-ed-cream font-light">Kind Words</h1>
          <p className="font-body text-ed-stone mt-4 max-w-xl">
            What location managers, scouts, and producers have said about filming at El Dorado Lofts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-ed-cream animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-3xl text-ed-mid">No testimonials yet</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featured.map(t => (
                    <div key={t.id} className="dark-section p-10 border border-ed-charcoal">
                      <div className="text-ed-gold text-5xl font-display leading-none mb-6">"</div>
                      <blockquote className="font-display text-xl text-ed-cream/90 leading-relaxed italic mb-8">
                        {t.quote}
                      </blockquote>
                      <div className="flex items-start gap-4">
                        {t.image_url && (
                          <img src={t.image_url} alt={t.person_name} className="w-12 h-12 object-cover rounded-full" />
                        )}
                        <div>
                          <p className="font-body text-ed-cream font-medium">{t.person_name}</p>
                          <p className="font-body text-ed-stone text-sm">{t.title}</p>
                          {t.company_or_production && (
                            <p className="font-mono text-[10px] text-ed-gold uppercase tracking-widest mt-1">
                              {t.company_or_production}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rest.map(t => (
                  <div key={t.id} className="border border-ed-stone/20 p-8">
                    <div className="text-ed-gold text-3xl font-display leading-none mb-4">"</div>
                    <blockquote className="font-body text-ed-mid leading-relaxed italic mb-6 text-sm">
                      {t.quote}
                    </blockquote>
                    <div>
                      <p className="font-body text-ed-black font-medium text-sm">{t.person_name}</p>
                      <p className="font-body text-ed-stone text-xs">{t.title}</p>
                      {t.company_or_production && (
                        <p className="font-mono text-[10px] text-ed-gold uppercase tracking-widest mt-1">
                          {t.company_or_production}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  )
}
