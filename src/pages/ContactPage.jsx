import { useState, useEffect } from 'react'
import PublicLayout from '../components/layout/PublicLayout'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('building_contact')
      .select('*')
      .limit(1)
      .single()
      .then(({ data }) => {
        setContact(data)
        setLoading(false)
      })
  }, [])

  const name = contact?.contact_name || 'Building Coordinator'
  const title = contact?.title || 'El Dorado Lofts Filming Coordinator'
  const email = contact?.email || 'film@eldoradolofts.com'
  const phone = contact?.phone || '(213) 555-0100'
  const preferred = contact?.preferred_contact_method || 'Email'
  const address = contact?.building_address || '416 S. Spring Street, Los Angeles, CA 90013'
  const notes = contact?.notes

  return (
    <PublicLayout>
      <div className="dark-section pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow mb-4">Get In Touch</p>
          <h1 className="font-display text-5xl md:text-6xl text-ed-cream font-light">Contact</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Building manager */}
          <div>
            <p className="eyebrow mb-6">Building Manager</p>
            <div className="bg-ed-black text-ed-cream p-10 mb-6">
              <p className="font-display text-3xl mb-1">{name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ed-gold mb-8">{title}</p>

              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ed-stone/60 mb-1">Email</p>
                  <a href={`mailto:${email}`} className="font-body text-ed-cream hover:text-ed-gold transition-colors">
                    {email}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ed-stone/60 mb-1">Phone</p>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="font-body text-ed-cream hover:text-ed-gold transition-colors">
                    {phone}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ed-stone/60 mb-1">Preferred Contact</p>
                  <p className="font-body text-ed-cream">{preferred}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ed-stone/60 mb-1">Building Address</p>
                  <p className="font-body text-ed-stone text-sm leading-relaxed">{address}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a href={`mailto:${email}`} className="btn-primary flex-1 justify-center text-xs">
                Send Email
              </a>
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="btn-ghost flex-1 justify-center text-xs">
                Call
              </a>
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            {/* General */}
            <div className="bg-ed-cream p-8 border border-ed-stone/20">
              <h3 className="font-display text-xl text-ed-black mb-3">General Filming Questions</h3>
              <p className="font-body text-sm text-ed-mid leading-relaxed">
                Contact the building manager for all general building questions, including common area access, 
                filming guidelines, COI and insurance requirements, permit process, load-in/load-out logistics, 
                and building-wide filming coordination.
              </p>
            </div>

            {/* Unit owners */}
            <div className="bg-ed-cream p-8 border border-ed-stone/20">
              <h3 className="font-display text-xl text-ed-black mb-3">Unit-Specific Inquiries</h3>
              <p className="font-body text-sm text-ed-mid leading-relaxed mb-4">
                For questions about a specific unit's availability, rate, scheduling, or access, 
                contact the unit owner directly using the contact information on their listing.
              </p>
              <a href="/units" className="btn-ghost-dark text-xs py-2 px-4 inline-flex">
                Browse Units →
              </a>
            </div>

            {/* Documents */}
            <div className="bg-ed-cream p-8 border border-ed-stone/20">
              <h3 className="font-display text-xl text-ed-black mb-3">Need Documents?</h3>
              <p className="font-body text-sm text-ed-mid leading-relaxed mb-4">
                Filming guidelines, COI requirements, location agreement templates, and application forms 
                are available to download on the Documents page.
              </p>
              <a href="/documents" className="btn-ghost-dark text-xs py-2 px-4 inline-flex">
                View Documents →
              </a>
            </div>

            {notes && (
              <div className="border-l-4 border-ed-gold p-6 bg-white">
                <p className="font-body text-sm text-ed-mid leading-relaxed">{notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
