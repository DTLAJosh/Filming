import { useState, useEffect } from 'react'
import PublicLayout from '../components/layout/PublicLayout'
import { supabase } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'

const DEFAULT_GUIDELINES = `
## Building Contact

For all filming inquiries, contact the El Dorado Lofts filming coordinator before scheduling a scout or submitting an application.

---

## Building Approval Process

All filming at El Dorado Lofts requires written approval from the building management. Productions must submit a completed Application to Film at least **10 business days** before the desired filming date. Rush applications may be considered on a case-by-case basis.

---

## Insurance Requirements

All productions must provide a Certificate of Insurance (COI) naming the El Dorado Homeowners Association as additionally insured. Minimum coverage requirements apply. See the COI Requirements document for specifics.

---

## COI Requirements

- General Liability: $2,000,000 per occurrence / $4,000,000 aggregate
- The El Dorado Lofts HOA must be named as Additional Insured
- Certificate must be received and approved before access is granted

---

## Permits

Productions are responsible for obtaining all required City of Los Angeles filming permits. A copy of all permits must be provided to building management before filming begins.

---

## Filming Hours

Standard permitted filming hours are **7:00 AM – 10:00 PM**, Monday through Saturday. Sunday and holiday filming requires advance approval and may be subject to additional fees. No filming is permitted before 7:00 AM without written exception.

---

## Load-In & Load-Out

All equipment must be loaded in and out through the designated service entrance. Load-in and load-out may begin one hour before and extend one hour after permitted filming hours. Advance coordination with building management is required for equipment moves.

---

## Elevator Use

Use of the main passenger elevator for equipment is restricted during peak morning hours (7:00–9:00 AM) and evening hours (5:00–7:00 PM). A freight or service elevator may be available — contact building management to confirm.

---

## Common Area Use

Use of lobbies, hallways, stairwells, rooftop, and exterior areas requires separate approval from building management and is subject to availability and additional fees. Common area filming does not grant access to individual units.

---

## Noise Rules

Productions must keep noise to reasonable levels at all times. Generator use must comply with city noise ordinances. Loud equipment, pyrotechnics, and amplified sound require advance written approval.

---

## Parking & Loading

Street parking is subject to City of Los Angeles regulations. Productions requiring parking holds or loading zones must obtain proper city permits. Building management can provide information on nearby production parking facilities.

---

## Security Requirements

Productions filming after 8:00 PM or with crew exceeding 20 persons must provide on-site licensed security. Security requirements are specified in the Location Agreement.

---

## Neighbor Notice

Productions are responsible for distributing neighbor notice letters to all units in affected corridors. A template is available on the Documents page. Notices must be distributed at least **48 hours** before filming.

---

## Cleaning & Restoration

The location must be restored to its original condition immediately following filming. Any damage to common areas or individual units is the responsibility of the production company. A refundable cleaning deposit may be required.

---

## Fees & Deposits

Location fees vary based on scope, crew size, duration, and areas used. A refundable security deposit is required for all productions. Fee schedules are available on the Documents page.

---

## HOA Requirements

All productions are subject to El Dorado Lofts HOA rules and regulations. Productions must cooperate with building management and security at all times.

---

## Contact for Questions

Contact the building filming coordinator for questions about guidelines, applications, COI requirements, and scheduling.
`

export default function GuidelinesPage() {
  const [guideline, setGuideline] = useState(null)
  const [buildingContact, setBuildingContact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [gRes, cRes] = await Promise.all([
        supabase.from('filming_guidelines').select('*').order('created_at').limit(1).single(),
        supabase.from('building_contact').select('*').limit(1).single(),
      ])
      setGuideline(gRes.data)
      setBuildingContact(cRes.data)
      setLoading(false)
    }
    load()
  }, [])

  const content = guideline?.content || DEFAULT_GUIDELINES
  const lastUpdated = guideline?.last_updated
    ? new Date(guideline.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <PublicLayout>
      <div className="dark-section pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="eyebrow mb-4">For Productions</p>
          <h1 className="font-display text-5xl md:text-6xl text-ed-cream font-light">Filming Guidelines</h1>
          <p className="font-body text-ed-stone mt-4 max-w-xl">
            Please review all guidelines before submitting a filming application or scheduling a location scout.
          </p>
          {lastUpdated && (
            <p className="font-mono text-[10px] text-ed-stone/60 uppercase tracking-widest mt-4">
              Last updated {lastUpdated}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-ed-cream rounded" />)}
              </div>
            ) : (
              <div className="prose prose-stone max-w-none font-body
                prose-h2:font-display prose-h2:text-2xl prose-h2:font-medium prose-h2:text-ed-black prose-h2:mt-10 prose-h2:mb-3
                prose-p:text-ed-mid prose-p:leading-relaxed prose-p:text-base
                prose-li:text-ed-mid prose-li:text-base
                prose-strong:text-ed-black
                prose-hr:border-ed-cream">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Building contact */}
            <div className="bg-ed-black text-ed-cream p-6">
              <p className="eyebrow mb-4">Questions?</p>
              {buildingContact?.contact_name && (
                <p className="font-display text-xl mb-1">{buildingContact.contact_name}</p>
              )}
              {buildingContact?.title && (
                <p className="font-mono text-[10px] uppercase tracking-widest text-ed-gold mb-5">{buildingContact.title}</p>
              )}
              <div className="space-y-2">
                {buildingContact?.email && (
                  <a href={`mailto:${buildingContact.email}`} className="block font-body text-sm text-ed-stone hover:text-ed-gold transition-colors">
                    {buildingContact.email}
                  </a>
                )}
                {buildingContact?.phone && (
                  <a href={`tel:${buildingContact.phone?.replace(/\D/g, '')}`} className="block font-body text-sm text-ed-stone hover:text-ed-gold transition-colors">
                    {buildingContact.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="border border-ed-stone/30 p-6">
              <p className="eyebrow mb-3">Documents</p>
              <p className="font-body text-xs text-ed-mid leading-relaxed mb-4">
                Download the COI requirements, location agreement template, neighbor notice, and application to film.
              </p>
              <a href="/documents" className="btn-ghost-dark text-xs py-2">
                View Documents →
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
