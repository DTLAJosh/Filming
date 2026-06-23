import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="dark-section text-ed-cream/60">
      <div className="shimmer-rule" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="font-display text-ed-gold text-2xl font-light tracking-widest uppercase mb-1">
              The El Dorado Lofts
            </div>
            <div className="font-mono text-[9px] tracking-widest2 uppercase text-ed-stone mb-6">
              Film Locations · Downtown Los Angeles
            </div>
            <p className="font-body text-xs leading-relaxed text-ed-stone">
              Historic character. Modern access.<br/>Film-friendly process.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="eyebrow mb-5">Explore</div>
            <div className="flex flex-col gap-2.5">
              {[
                { to: '/units', label: 'Available Units' },
                { to: '/guidelines', label: 'Filming Guidelines' },
                { to: '/documents', label: 'Documents' },
                { to: '/testimonials', label: 'Kind Words' },
                { to: '/contact', label: 'Contact' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="font-body text-xs text-ed-stone hover:text-ed-gold transition-colors tracking-wide">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="eyebrow mb-5">Building Contact</div>
            <div className="font-body text-xs leading-relaxed text-ed-stone space-y-1">
              <p>The El Dorado Lofts</p>
              <p>416 S. Spring St.</p>
              <p>Los Angeles, CA 90013</p>
              <p className="pt-3">
                <a href="mailto:manager@eldoradolofts.com" className="hover:text-ed-gold transition-colors">
                  manager@eldoradolofts.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-ed-charcoal mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-ed-stone/60 tracking-wide">
            © {new Date().getFullYear()} The El Dorado Lofts · All filming inquiries subject to building guidelines
          </p>
          <div className="flex gap-6">
            <Link to="/dashboard" className="font-mono text-[10px] text-ed-stone/60 hover:text-ed-gold transition-colors tracking-wide uppercase">
              Homeowner Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
