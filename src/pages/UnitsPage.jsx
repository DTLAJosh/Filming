import { useState, useEffect } from 'react'
import PublicLayout from '../components/layout/PublicLayout'
import UnitCard from '../components/units/UnitCard'
import FurnishingBadge from '../components/ui/FurnishingBadge'
import { supabase } from '../lib/supabase'

const FEATURE_OPTIONS = [
  'Historic Windows', 'Exposed Brick', 'Concrete Floors', 'Skyline Views',
  'High Ceilings', 'Modern Kitchen', 'Vintage Details', 'Rooftop Access',
  'Minimalist', 'Industrial', 'Luxury', 'Raw Loft', 'Natural Light',
]

const FURNISHING_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'furnished', label: 'Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'partially_furnished', label: 'Partially Furnished' },
  { value: 'flexible', label: 'Flexible' },
]

const SIZE_RANGES = [
  { label: 'Any Size', min: 0, max: Infinity },
  { label: 'Under 800 sq ft', min: 0, max: 800 },
  { label: '800 – 1,200 sq ft', min: 800, max: 1200 },
  { label: '1,200 – 2,000 sq ft', min: 1200, max: 2000 },
  { label: '2,000+ sq ft', min: 2000, max: Infinity },
]

export default function UnitsPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [furnishingFilter, setFurnishingFilter] = useState('')
  const [sizeRange, setSizeRange] = useState(0)
  const [selectedFeatures, setSelectedFeatures] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('units')
        .select('*, unit_photos(image_url, sort_order)')
        .eq('status', 'published')
        .eq('admin_hidden', false)
        .order('created_at', { ascending: false })
      if (data) setUnits(data)
      setLoading(false)
    }
    load()
  }, [])

  const range = SIZE_RANGES[sizeRange]

  const filtered = units.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || [u.title, u.description, u.filming_notes, ...(u.features || [])]
      .some(s => s?.toLowerCase().includes(q))
    const matchFurnishing = !furnishingFilter || u.furnishing_status === furnishingFilter
    const matchSize = !u.square_feet ||
      (u.square_feet >= range.min && (range.max === Infinity || u.square_feet <= range.max))
    const matchFeatures = selectedFeatures.length === 0 ||
      selectedFeatures.every(f => u.features?.includes(f))
    return matchSearch && matchFurnishing && matchSize && matchFeatures
  })

  const toggleFeature = (f) => {
    setSelectedFeatures(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  return (
    <PublicLayout>
      {/* Header */}
      <div className="dark-section pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow mb-4">Available for Filming</p>
          <h1 className="font-display text-5xl md:text-6xl text-ed-cream font-light">Units</h1>
          <p className="font-body text-ed-stone mt-4 max-w-xl">
            Browse homeowner-listed units available for film, TV, commercial, and photo production. 
            Contact unit owners directly for availability.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="bg-ed-cream p-6 mb-10 border border-ed-stone/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* Search */}
            <div>
              <label className="form-label">Search</label>
              <input
                className="form-input"
                placeholder="Keyword search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Furnishing */}
            <div>
              <label className="form-label">Furnishing Status</label>
              <select
                className="form-input"
                value={furnishingFilter}
                onChange={e => setFurnishingFilter(e.target.value)}
              >
                {FURNISHING_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {/* Size */}
            <div>
              <label className="form-label">Approximate Size</label>
              <select
                className="form-input"
                value={sizeRange}
                onChange={e => setSizeRange(Number(e.target.value))}
              >
                {SIZE_RANGES.map((r, i) => (
                  <option key={i} value={i}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Feature tags */}
          <div>
            <label className="form-label mb-2.5">Filter by Feature</label>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={`px-3 py-1 font-body text-[10px] uppercase tracking-widest border transition-all ${
                    selectedFeatures.includes(f)
                      ? 'border-ed-gold bg-ed-gold/10 text-ed-gold-dk'
                      : 'border-ed-stone/30 text-ed-mid hover:border-ed-gold/50'
                  }`}
                >
                  {f}
                </button>
              ))}
              {selectedFeatures.length > 0 && (
                <button
                  onClick={() => setSelectedFeatures([])}
                  className="px-3 py-1 font-body text-[10px] uppercase tracking-widest text-ed-stone hover:text-red-600 transition-colors"
                >
                  Clear ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-mono text-xs text-ed-stone uppercase tracking-widest">
            {loading ? 'Loading…' : `${filtered.length} unit${filtered.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-ed-cream animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 border border-ed-cream">
            <p className="font-display text-3xl text-ed-mid mb-3">No units found</p>
            <p className="font-body text-sm text-ed-stone">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(unit => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
