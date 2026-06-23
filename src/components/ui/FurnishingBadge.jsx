const labels = {
  furnished: 'Furnished',
  unfurnished: 'Unfurnished',
  partially_furnished: 'Partially Furnished',
  flexible: 'Flexible',
}

const styles = {
  furnished: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  unfurnished: 'bg-stone-100 text-stone-700 border-stone-200',
  partially_furnished: 'bg-amber-50 text-amber-800 border-amber-200',
  flexible: 'bg-sky-50 text-sky-800 border-sky-200',
}

export default function FurnishingBadge({ status, size = 'md' }) {
  if (!status) return null
  const label = labels[status] || status
  const style = styles[status] || styles.flexible
  const sizeClass = size === 'lg'
    ? 'text-sm px-4 py-1.5 font-medium tracking-wide'
    : 'text-xs px-3 py-1 tracking-wide'

  return (
    <span className={`inline-flex items-center border rounded-none font-body uppercase ${style} ${sizeClass}`}>
      {label}
    </span>
  )
}
