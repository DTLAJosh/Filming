import { Link } from 'react-router-dom'
import FurnishingBadge from '../ui/FurnishingBadge'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'

export default function UnitCard({ unit }) {
  const photo = unit.unit_photos?.[0]?.image_url || PLACEHOLDER
  const specs = [
    unit.square_feet && `${unit.square_feet.toLocaleString()} sq ft`,
    unit.bedrooms != null && `${unit.bedrooms} bed`,
    unit.bathrooms != null && `${unit.bathrooms} bath`,
    unit.floor && `Floor ${unit.floor}`,
  ].filter(Boolean)

  const features = Array.isArray(unit.features) ? unit.features : []

  return (
    <Link to={`/units/${unit.id}`} className="group block card overflow-hidden">
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ed-cream">
        <img
          src={photo}
          alt={unit.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        {/* Furnishing badge overlay */}
        <div className="absolute top-3 left-3">
          <FurnishingBadge status={unit.furnishing_status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-medium text-ed-black leading-snug mb-1">
          {unit.title}
        </h3>

        {/* Specs row */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 mb-3">
            {specs.map((s, i) => (
              <span key={i} className="font-mono text-[10px] text-ed-mid uppercase tracking-widest">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Description excerpt */}
        {unit.description && (
          <p className="font-body text-sm text-ed-mid leading-relaxed line-clamp-2 mb-4">
            {unit.description}
          </p>
        )}

        {/* Feature tags */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {features.slice(0, 4).map(f => (
              <span key={f} className="font-body text-[10px] uppercase tracking-widest px-2 py-0.5 bg-ed-cream text-ed-mid border border-ed-stone/20">
                {f.replace(/_/g, ' ')}
              </span>
            ))}
            {features.length > 4 && (
              <span className="font-body text-[10px] uppercase tracking-widest px-2 py-0.5 text-ed-stone">
                +{features.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-ed-cream flex items-center justify-between">
          <span className="font-body text-xs uppercase tracking-widest text-ed-gold group-hover:underline">
            View Details →
          </span>
          {unit.contact_name && (
            <span className="font-body text-xs text-ed-stone truncate max-w-[120px]">
              {unit.contact_name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
