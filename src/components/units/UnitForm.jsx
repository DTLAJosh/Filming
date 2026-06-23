import { useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

const FEATURE_OPTIONS = [
  'Historic Windows', 'Exposed Brick', 'Concrete Floors', 'Skyline Views',
  'High Ceilings', 'Modern Kitchen', 'Vintage Details', 'Rooftop Access',
  'Minimalist', 'Industrial', 'Luxury', 'Raw Loft', 'Natural Light',
  'Hardwood Floors', 'Open Floor Plan', 'Large Windows', 'City Views',
]

const FURNISHING_OPTIONS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'partially_furnished', label: 'Partially Furnished' },
  { value: 'flexible', label: 'Flexible' },
]

const CONTACT_METHODS = ['Email', 'Phone', 'Text']

export default function UnitForm({ initialData = {}, onSave, isLoading }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    unit_number: '',
    hide_unit_number: true,
    description: '',
    square_feet: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    furnishing_status: 'furnished',
    furnishing_notes: '',
    features: [],
    filming_notes: '',
    restrictions: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    preferred_contact_method: 'Email',
    status: 'draft',
    ...initialData,
    features: Array.isArray(initialData.features) ? initialData.features : [],
  })

  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const toggleFeature = (f) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f],
    }))
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const uploaded = []
      for (const file of files) {
        const ext = file.name.split('.').pop()
        const path = `unit-photos/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('unit-photos')
          .upload(path, file)
        if (upErr) throw upErr
        const { data: { publicUrl } } = supabase.storage
          .from('unit-photos')
          .getPublicUrl(path)
        uploaded.push(publicUrl)
      }
      setPhotos(prev => [...prev, ...uploaded])
    } catch (err) {
      setError('Photo upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e, statusOverride) => {
    e.preventDefault()
    setError(null)
    const payload = {
      ...form,
      square_feet: form.square_feet ? parseInt(form.square_feet) : null,
      bedrooms: form.bedrooms !== '' ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms !== '' ? parseFloat(form.bathrooms) : null,
      floor: form.floor !== '' ? parseInt(form.floor) : null,
      status: statusOverride || form.status,
      features: form.features,
    }
    await onSave(payload, photos)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white p-6 border border-ed-cream">
        <h3 className="font-display text-xl mb-5 text-ed-black">Unit Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="form-label">Unit Title *</label>
            <input className="form-input" value={form.title} onChange={set('title')} required placeholder="e.g. Industrial Loft with Skyline Views" />
          </div>
          <div>
            <label className="form-label">Unit Number</label>
            <input className="form-input" value={form.unit_number} onChange={set('unit_number')} placeholder="e.g. 404" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="hide_unit_number"
              checked={form.hide_unit_number}
              onChange={set('hide_unit_number')}
              className="w-4 h-4 accent-ed-gold"
            />
            <label htmlFor="hide_unit_number" className="font-body text-sm text-ed-mid cursor-pointer">
              Hide unit number on public listing
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description *</label>
            <textarea
              className="form-input min-h-[120px] resize-y"
              value={form.description}
              onChange={set('description')}
              required
              placeholder="Describe the unit's character, atmosphere, and what makes it unique for filming…"
            />
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="bg-white p-6 border border-ed-cream">
        <h3 className="font-display text-xl mb-5 text-ed-black">Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <label className="form-label">Square Feet</label>
            <input type="number" className="form-input" value={form.square_feet} onChange={set('square_feet')} placeholder="1200" />
          </div>
          <div>
            <label className="form-label">Bedrooms</label>
            <input type="number" className="form-input" value={form.bedrooms} onChange={set('bedrooms')} placeholder="1" min="0" />
          </div>
          <div>
            <label className="form-label">Bathrooms</label>
            <input type="number" className="form-input" value={form.bathrooms} onChange={set('bathrooms')} placeholder="1" min="0" step="0.5" />
          </div>
          <div>
            <label className="form-label">Floor</label>
            <input type="number" className="form-input" value={form.floor} onChange={set('floor')} placeholder="4" min="1" />
          </div>
        </div>
      </section>

      {/* Furnishing */}
      <section className="bg-white p-6 border border-ed-cream">
        <h3 className="font-display text-xl mb-5 text-ed-black">Furnishing Status</h3>
        <p className="font-body text-sm text-ed-mid mb-4">This is prominently displayed to scouts — choose carefully.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {FURNISHING_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, furnishing_status: opt.value }))}
              className={`py-3 px-4 border font-body text-sm uppercase tracking-widest transition-all ${
                form.furnishing_status === opt.value
                  ? 'border-ed-gold bg-ed-gold text-ed-black'
                  : 'border-ed-stone/30 text-ed-mid hover:border-ed-gold'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div>
          <label className="form-label">Furnishing Notes (optional)</label>
          <input
            className="form-input"
            value={form.furnishing_notes}
            onChange={set('furnishing_notes')}
            placeholder="e.g. Mid-century furniture can be removed; kitchen fully equipped"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white p-6 border border-ed-cream">
        <h3 className="font-display text-xl mb-5 text-ed-black">Features & Tags</h3>
        <div className="flex flex-wrap gap-2">
          {FEATURE_OPTIONS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFeature(f)}
              className={`px-3 py-1.5 font-body text-xs uppercase tracking-widest border transition-all ${
                form.features.includes(f)
                  ? 'border-ed-gold bg-ed-gold/10 text-ed-gold-dk'
                  : 'border-ed-stone/30 text-ed-mid hover:border-ed-gold/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Filming Notes */}
      <section className="bg-white p-6 border border-ed-cream">
        <h3 className="font-display text-xl mb-5 text-ed-black">Filming Notes & Restrictions</h3>
        <div className="space-y-5">
          <div>
            <label className="form-label">Filming Notes</label>
            <textarea
              className="form-input min-h-[80px] resize-y"
              value={form.filming_notes}
              onChange={set('filming_notes')}
              placeholder="Any special notes for productions — power access, staging areas, scheduling preferences…"
            />
          </div>
          <div>
            <label className="form-label">Restrictions</label>
            <textarea
              className="form-input min-h-[80px] resize-y"
              value={form.restrictions}
              onChange={set('restrictions')}
              placeholder="Any restrictions — no heavy equipment, no pyrotechnics, quiet hours, etc…"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white p-6 border border-ed-cream">
        <h3 className="font-display text-xl mb-5 text-ed-black">Contact Information</h3>
        <p className="font-body text-sm text-ed-mid mb-5">This will be shown publicly to scouts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Contact Name *</label>
            <input className="form-input" value={form.contact_name} onChange={set('contact_name')} required placeholder="Your name or representative" />
          </div>
          <div>
            <label className="form-label">Contact Email</label>
            <input type="email" className="form-input" value={form.contact_email} onChange={set('contact_email')} placeholder="you@example.com" />
          </div>
          <div>
            <label className="form-label">Contact Phone</label>
            <input type="tel" className="form-input" value={form.contact_phone} onChange={set('contact_phone')} placeholder="(213) 555-0100" />
          </div>
          <div>
            <label className="form-label">Preferred Contact Method</label>
            <select className="form-input" value={form.preferred_contact_method} onChange={set('preferred_contact_method')}>
              {CONTACT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white p-6 border border-ed-cream">
        <h3 className="font-display text-xl mb-5 text-ed-black">Photos</h3>
        <p className="font-body text-sm text-ed-mid mb-4">Upload photos of your unit. High-resolution landscape images work best.</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="font-body text-sm text-ed-mid"
        />
        {uploading && <p className="font-body text-sm text-ed-gold mt-2">Uploading…</p>}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {photos.map((url, i) => (
              <img key={i} src={url} alt="" className="aspect-video object-cover w-full" />
            ))}
          </div>
        )}
        {initialData.unit_photos?.length > 0 && (
          <div className="mt-4">
            <p className="font-body text-xs text-ed-stone uppercase tracking-widest mb-2">Existing Photos</p>
            <div className="grid grid-cols-3 gap-3">
              {initialData.unit_photos.map(p => (
                <img key={p.id} src={p.image_url} alt={p.caption || ''} className="aspect-video object-cover w-full" />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isLoading}
          onClick={(e) => handleSubmit(e, 'draft')}
          className="btn-ghost-dark"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={isLoading}
          onClick={(e) => handleSubmit(e, 'published')}
          className="btn-primary"
        >
          {isLoading ? 'Saving…' : 'Publish Listing'}
        </button>
      </div>
    </form>
  )
}
