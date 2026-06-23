import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import FurnishingBadge from '../components/ui/FurnishingBadge'
import { supabase } from '../lib/supabase'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'

export default function UnitDetailPage() {
  const { id } = useParams()
  const [unit, setUnit] = useState(null)
  const [photos, setPhotos] = useState([])
  const [activePhoto, setActivePhoto] = useState(0)
  const [loading, setLoading] = useState(true)
  const [buildingContact, setBuildingContact] = useState(null)

  useEffect(() => {
    async function load() {
      const [unitRes, contactRes] = await Promise.all([
        supabase
          .from('units')
          .select('*, unit_photos(*)')
          .eq('id', id)
          .eq('status', 'published')
          .eq('admin_hidden', false)
          .single(),
        supabase.from('building_contact').select('*').limit(1).single(),
      ])
      if (unitRes.data) {
        setUnit(unitRes.data)
        const sorted = (unitRes.data.unit_photos || []).sort((a, b) => a.sort_order - b.sort_order)
        setPhotos(sorted.length > 0 ? sorted.map(p => p.image_url) : [PLACEHOLDER])
      }
      if (contactRes.data) setBuildingContact(contactRes.data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="font-display text-2xl italic text-ed-mid">Loading…</div>
      </div>
    </PublicLayout>
  )

  if (!unit) return (
    <PublicLayout>
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className="font-display text-3xl text-ed-mid">Unit not found</p>
        <Link to="/units" className="btn-ghost-dark">Browse Units</Link>
      </div>
    </PublicLayout>
  )

  const features = Array.isArray(unit.features) ? unit.features : []
  const specs = [
    { label: 'Square Feet', value: unit.square_feet ? `${unit.square_feet.toLocaleString()} sq ft` : null },
    { label: 'Bedrooms', value: unit.bedrooms != null ? unit.bedrooms : null },
    { label: 'Bathrooms', value: unit.bathrooms != null ? unit.bathrooms : null },
    { label: 'Floor', value: unit.floor ? `Floor ${unit.floor}` : null },
    { label: 'Unit', value: (!unit.hide_unit_number && unit.unit_number) ? `#${unit.unit_number}` : null },
  ].filter(s => s.value != null)

  const contactEmail = unit.contact_email
  const contactPhone = unit.contact_phone
  const buildingEmail = buildingContact?.email || 'film@eldoradolofts.com'
  const buildingPhone = buildingContact?.phone || '(213) 555-0100'

  function buildContactHref() {
    const method = unit.preferred_contact_method?.toLowerCase()
    if (method === 'email' && contactEmail) return `mailto:${contactEmail}`
    if ((method === 'text' || method === 'phone') && contactPhone) return `tel:${contactPhone.replace(/\D/g, '')}`
    if (contactEmail) return `mailto:${contactEmail}`
    if (contactPhone) return `tel:${contactPhone.replace(/\D/g, '')}`
    return null
  }

  const contactHref = buildContactHref()

  return (
    <PublicLayout>
      <div className="pt-20">
        {/* Photo gallery */}
        <div className="bg-ed-black">
          <div className="max-w-7xl mx-auto">
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <img
                src={photos[activePhoto] || PLACEHOLDER}
                alt={unit.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = PLACEHOLDER }}
              />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {photos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`shrink-0 w-20 h-14 overflow-hidden border-2 transition-all ${
                      i === activePhoto ? 'border-ed-gold' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <Link to="/units" className="font-mono text-[10px] uppercase tracking-widest text-ed-stone hover:text-ed-gold transition-colors">
                ← All Units
              </Link>

              <div className="mt-6 mb-8">
                <div className="flex flex-wrap items-start gap-4 mb-3">
                  <h1 className="font-display text-4xl md:text-5xl font-light text-ed-black leading-tight">
                    {unit.title}
                  </h1>
                </div>
                <FurnishingBadge status={unit.furnishing_status} size="lg" />
                {unit.furnishing_notes && (
                  <p className="font-body text-sm text-ed-mid mt-2 italic">{unit.furnishing_notes}</p>
                )}
              </div>

              {/* Specs */}
              {specs.length > 0 && (
                <div className="flex flex-wrap gap-6 py-5 border-y border-ed-cream mb-8">
                  {specs.map(s => (
                    <div key={s.label}>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-ed-stone">{s.label}</p>
                      <p className="font-body text-sm font-medium text-ed-black mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-display text-2xl text-ed-black mb-4">About This Unit</h2>
                <p className="font-body text-base text-ed-mid leading-relaxed">{unit.description}</p>
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-2xl text-ed-black mb-4">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {features.map(f => (
                      <span key={f} className="px-3 py-1.5 font-body text-xs uppercase tracking-widest border border-ed-stone/30 text-ed-mid">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Filming notes */}
              {unit.filming_notes && (
                <div className="mb-8 bg-ed-cream p-6 border border-ed-stone/20">
                  <h2 className="font-display text-xl text-ed-black mb-3">Filming Notes</h2>
                  <p className="font-body text-sm text-ed-mid leading-relaxed">{unit.filming_notes}</p>
                </div>
              )}

              {/* Restrictions */}
              {unit.restrictions && (
                <div className="mb-8 bg-amber-50 p-6 border border-amber-200">
                  <h2 className="font-display text-xl text-ed-black mb-3">Restrictions</h2>
                  <p className="font-body text-sm text-amber-800 leading-relaxed">{unit.restrictions}</p>
                </div>
              )}

              {/* Guidelines note */}
              <div className="bg-ed-dark text-ed-cream/70 p-6 border-l-4 border-ed-gold">
                <p className="font-body text-xs leading-relaxed">
                  All filming at El Dorado Lofts must comply with building guidelines, including COI requirements, 
                  permitted hours, and neighbor notification protocols.{' '}
                  <Link to="/guidelines" className="text-ed-gold hover:underline">View Filming Guidelines →</Link>
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact unit owner */}
              <div className="bg-ed-black text-ed-cream p-8">
                <p className="eyebrow mb-4">Contact This Unit</p>
                {unit.contact_name && (
                  <p className="font-display text-2xl mb-1">{unit.contact_name}</p>
                )}
                {unit.preferred_contact_method && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ed-gold mb-5">
                    Prefers {unit.preferred_contact_method}
                  </p>
                )}

                <div className="space-y-3 mb-6">
                  {contactEmail && (
                    <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 font-body text-sm text-ed-stone hover:text-ed-gold transition-colors">
                      <span>✉</span> {contactEmail}
                    </a>
                  )}
                  {contactPhone && (
                    <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="flex items-center gap-2 font-body text-sm text-ed-stone hover:text-ed-gold transition-colors">
                      <span>☎</span> {contactPhone}
                    </a>
                  )}
                </div>

                {contactHref && (
                  <a href={contactHref} className="btn-primary w-full justify-center">
                    Contact Unit Owner
                  </a>
                )}
              </div>

              {/* Contact building */}
              <div className="border border-ed-stone/30 p-6">
                <p className="eyebrow mb-3">Building Manager</p>
                <p className="font-body text-sm text-ed-mid leading-relaxed mb-4">
                  For general filming questions, common areas, guidelines, and building-wide logistics, 
                  contact the building manager.
                </p>
                <div className="space-y-2 mb-4">
                  {buildingContact?.contact_name && (
                    <p className="font-body text-sm font-medium text-ed-black">{buildingContact.contact_name}</p>
                  )}
                  <a href={`mailto:${buildingEmail}`} className="block font-body text-sm text-ed-gold hover:underline">
                    {buildingEmail}
                  </a>
                  <a href={`tel:${buildingPhone.replace(/\D/g, '')}`} className="block font-body text-sm text-ed-mid hover:text-ed-gold transition-colors">
                    {buildingPhone}
                  </a>
                </div>
                <Link to="/contact" className="btn-ghost-dark text-xs py-2">
                  Building Contact Info
                </Link>
              </div>

              {/* Documents */}
              <div className="bg-ed-cream p-6 border border-ed-stone/20">
                <p className="eyebrow mb-3">Documents</p>
                <p className="font-body text-xs text-ed-mid leading-relaxed mb-4">
                  Download filming guidelines, COI requirements, and location agreement templates.
                </p>
                <Link to="/documents" className="btn-ghost-dark text-xs py-2">
                  View Documents →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
