import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import UnitCard from '../components/units/UnitCard'
import { supabase } from '../lib/supabase'

const HERO_BG = '/el-dorado-hero.jpg'

const BUILDING_FEATURES = [
  {
    icon: '🏛',
    title: 'Historic Architecture',
    body: 'Built in 1928, El Dorado\'s Spanish Renaissance facade, ornate lobby, and original detailing offer production designers an authentic period backdrop rarely found in working residential buildings.',
  },
  {
    icon: '🎬',
    title: 'Multiple Looks, One Address',
    body: 'From raw industrial lofts to polished modern interiors, furnished suites to blank-canvas spaces — every unit offers a different visual story. One location fee, infinite production value.',
  },
  {
    icon: '📋',
    title: 'Straightforward Process',
    body: 'A clear set of filming guidelines, COI requirements, and a single point of contact makes El Dorado easy to book and even easier to work in. We\'ve hosted productions of every size.',
  },
  {
    icon: '🌆',
    title: 'Downtown Los Angeles Access',
    body: 'Located in the Spring Street Arts Corridor, minutes from DTLA production infrastructure, grip houses, and staging facilities. Ample street-level loading access.',
  },
  {
    icon: '🏢',
    title: 'Common Areas Available',
    body: 'The lobby, corridors, stairwells, rooftop, and exterior may be available for permitted filming. Contact the building manager to discuss common area access.',
  },
  {
    icon: '📸',
    title: 'Production-Friendly Owners',
    body: 'El Dorado homeowners who list their units have opted in to the process. They understand productions and are prepared to work with location managers from first scout to wrap day.',
  },
]

export default function HomePage() {
  const [featuredUnits, setFeaturedUnits] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [buildingContact, setBuildingContact] = useState(null)

  useEffect(() => {
    async function load() {
      const [unitsRes, testimonialsRes, contactRes] = await Promise.all([
        supabase
          .from('units')
          .select('*, unit_photos(image_url, sort_order)')
          .eq('status', 'published')
          .eq('admin_hidden', false)
          .eq('is_featured', true)
          .limit(3),
        supabase
          .from('testimonials')
          .select('*')
          .eq('is_public', true)
          .eq('is_featured', true)
          .limit(3),
        supabase
          .from('building_contact')
          .select('*')
          .limit(1)
          .single(),
      ])
      if (unitsRes.data) setFeaturedUnits(unitsRes.data)
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data)
      if (contactRes.data) setBuildingContact(contactRes.data)
    }
    load()
  }, [])

  const contactEmail = buildingContact?.email || 'film@eldoradolofts.com'
  const contactPhone = buildingContact?.phone || '(213) 555-0100'

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-end">
        <img
          src={HERO_BG}
          alt="El Dorado Lofts exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 md:pb-28 w-full">
          <div className="max-w-3xl">
            <p className="eyebrow text-ed-gold/90 mb-6">Downtown Los Angeles · Est. 1928</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-ed-white font-light leading-[1.05] mb-6">
              Film at<br />
              <em className="not-italic text-ed-gold">El Dorado</em><br />
              Lofts
            </h1>
            <p className="font-body text-base md:text-lg text-ed-cream/80 max-w-xl leading-relaxed mb-10">
              One of Downtown LA's most film-friendly residential locations. 
              Historic character, flexible interiors, and a building process 
              designed around production from the start.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/units" className="btn-primary">
                View Available Units
              </Link>
              <Link to="/documents" className="btn-ghost">
                Download Filming Guidelines
              </Link>
              <a href={`mailto:${contactEmail}`} className="btn-ghost">
                Contact Building Manager
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro tagline ── */}
      <section className="dark-section py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="shimmer-rule mb-10" />
          <blockquote className="font-display text-2xl md:text-4xl text-ed-cream font-light italic leading-snug">
            "Historic character. Modern access.<br />
            <span className="text-ed-gold not-italic">Film-friendly process.</span>"
          </blockquote>
          <div className="shimmer-rule mt-10" />
        </div>
      </section>

      {/* ── About copy ── */}
      <section className="section-pad bg-ed-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow mb-5">About the Building</p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6 text-ed-black">
                A Rare Combination<br />of History & Access
              </h2>
              <p className="font-body text-base text-ed-mid leading-relaxed mb-5">
                The El Dorado Lofts offers production teams a rare combination of historic Downtown Los Angeles 
                character, flexible residential interiors, dramatic architectural details, and a straightforward 
                building process designed to make filming easier from first scout to final wrap.
              </p>
              <p className="font-body text-base text-ed-mid leading-relaxed mb-8">
                Whether you need a furnished period interior, a stripped-down raw loft, dramatic corridor 
                perspectives, or rooftop skyline backdrops, El Dorado's range of individually owned units 
                means you can often find multiple looks within a single building — dramatically simplifying 
                logistics for complex productions.
              </p>
              <Link to="/units" className="btn-ghost-dark">
                Browse Available Units →
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                alt="El Dorado interior"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-ed-gold p-5 hidden md:block">
                <p className="font-display text-3xl text-ed-black font-light">1928</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-ed-dark mt-0.5">Year Built</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Building features ── */}
      <section className="section-pad bg-ed-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="eyebrow mb-4">Why El Dorado</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ed-black">Built for Production</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BUILDING_FEATURES.map((f, i) => (
              <div key={i} className="bg-ed-white p-8 border border-ed-stone/20">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display text-xl font-medium text-ed-black mb-3">{f.title}</h3>
                <p className="font-body text-sm text-ed-mid leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured units ── */}
      {featuredUnits.length > 0 && (
        <section className="section-pad bg-ed-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="eyebrow mb-3">Available for Filming</p>
                <h2 className="font-display text-4xl md:text-5xl font-light text-ed-black">Featured Units</h2>
              </div>
              <Link to="/units" className="btn-ghost-dark hidden md:inline-flex">
                View All Units
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredUnits.map(unit => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
            <div className="mt-8 md:hidden">
              <Link to="/units" className="btn-ghost-dark w-full text-center">View All Units</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials preview ── */}
      {testimonials.length > 0 && (
        <section className="section-pad dark-section">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="eyebrow mb-4">Kind Words</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-ed-cream">From the Industry</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(t => (
                <div key={t.id} className="border border-ed-charcoal p-8">
                  <div className="text-ed-gold text-3xl font-display mb-4">"</div>
                  <blockquote className="font-body text-ed-cream/80 leading-relaxed mb-6 italic">
                    {t.quote}
                  </blockquote>
                  <div>
                    <p className="font-body text-ed-cream font-medium text-sm">{t.person_name}</p>
                    <p className="font-body text-ed-stone text-xs mt-0.5">{t.title}</p>
                    {t.company_or_production && (
                      <p className="font-mono text-[10px] text-ed-gold uppercase tracking-widest mt-1">{t.company_or_production}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/testimonials" className="btn-ghost">
                Read More
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA strip ── */}
      <section className="bg-ed-gold py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-ed-black font-light mb-4">
            Ready to Scout El Dorado?
          </h2>
          <p className="font-body text-ed-dark/70 mb-8 max-w-lg mx-auto">
            Browse available units, download filming guidelines, or reach out to the building manager directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/units" className="btn-ghost-dark">Browse Units</Link>
            <a href={`mailto:${contactEmail}`} className="btn-ghost-dark">
              {contactEmail}
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
