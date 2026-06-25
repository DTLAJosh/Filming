import { useState, useEffect } from 'react'
import PublicLayout from '../components/layout/PublicLayout'
import { supabase } from '../lib/supabase'

const GUIDELINES_SECTIONS = [
  {
    title: 'Building Contact',
    content: 'For all filming inquiries, contact the El Dorado Lofts filming coordinator before scheduling a scout or submitting an application.',
  },
  {
    title: 'Building Approval Process',
    content: 'All filming at El Dorado Lofts requires written approval from the building management. Productions must submit a completed Application to Film at least 10 business days before the desired filming date. Rush applications may be considered on a case-by-case basis.',
  },
  {
    title: 'Insurance Requirements',
    content: 'All productions must provide a Certificate of Insurance (COI) naming the El Dorado Homeowners Association as additionally insured. Minimum coverage requirements apply. See the COI Requirements document for specifics.',
  },
  {
    title: 'COI Requirements',
    items: [
      'General Liability: $2,000,000 per occurrence / $4,000,000 aggregate',
      'The El Dorado Lofts HOA must be named as Additional Insured',
      'Certificate must be received and approved before access is granted',
    ],
  },
  {
    title: 'Permits',
    content: 'Productions are responsible for obtaining all required City of Los Angeles filming permits. A copy of all permits must be provided to building management before filming begins.',
  },
  {
    title: 'Filming Hours',
    content: 'Standard permitted filming hours are 7:00 AM – 10:00 PM, Monday through Saturday. Sunday and holiday filming requires advance approval and may be subject to additional fees. No filming is permitted before 7:00 AM without written exception.',
  },
  {
    title: 'Load-In & Load-Out',
    content: 'All equipment must be loaded in and out through the designated service entrance. Load-in and load-out may begin one hour before and extend one hour after permitted filming hours. Advance coordination with building management is required for equipment moves.',
  },
  {
    title: 'Elevator Use',
    content: 'Use of the main passenger elevator for equipment is restricted during peak morning hours (7:00–9:00 AM) and evening hours (5:00–7:00 PM). A freight or service elevator may be available — contact building management to confirm.',
  },
  {
    title: 'Common Area Use',
    content: 'Use of lobbies, hallways, stairwells, rooftop, and exterior areas requires separate approval from building management and is subject to availability and additional fees. Common area filming does not grant access to individual units.',
  },
  {
    title: 'Noise Rules',
    content: 'Productions must keep noise to reasonable levels at all times. Generator use must comply with city noise ordinances. Loud equipment, pyrotechnics, and amplified sound require advance written approval.',
  },
  {
    title: 'Parking & Loading',
    content: 'Street parking is subject to City of Los Angeles regulations. Productions requiring parking holds or loading zones must obtain proper city permits. Building management can provide information on nearby production parking facilities.',
  },
  {
    title: 'Security Requirements',
    content: 'Productions filming after 8:00 PM or with crew exceeding 20 persons must provide on-site licensed security. Security requirements are specified in the Location Agreement.',
  },
  {
    title: 'Neighbor Notice',
    content: 'Productions are responsible for distributing neighbor notice letters to all units in affected corridors. A template is available on the Documents page. Notices must be distributed at least 48 hours before filming.',
  },
  {
    title: 'Cleaning & Restoration',
    content: 'The location must be restored to its original condition immediately following filming. Any damage to common areas or individual units is the responsibility of the production company. A refundable cleaning deposit may be required.',
  },
  {
    title: 'Fees & Deposits',
    content: 'Location fees vary based on scope, crew size, duration, and areas used. A refundable security deposit is required for all productions. Fee schedules are available on the Documents page.',
  },
  {
    title: 'HOA Requirements',
    content: 'All productions are subject to El Dorado Lofts HOA rules and regulations. Productions must cooperate with building management and security at all times.',
  },
  {
    title: 'Contact for Questions',
    content: 'Contact the building filming coordinator for questions about guidelines, applications, COI requirements, and scheduling.',
  },
]

export default function GuidelinesPage() {
  const [buildingContact, setBuildingContact] = useState(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('building_contact')
        .select('name, title, email, phone')
        .limit(1)
        .single()
      if (data) setBuildingContact(data)
    }
    load()
  }, [])

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-stone-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-widest text-amber-500 uppercase mb-3">For Productions</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Filming Guidelines</h1>
          <p className="text-stone-400 max-w-xl">
            Please review all guidelines before submitting a filming application or scheduling a location scout.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-stone-50 py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {GUIDELINES_SECTIONS.map((section, i) => (
              <div key={i} className="mb-10">
                <h2 className="font-serif text-xl text-stone-900 mb-3 pb-2 border-b border-stone-200">
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-stone-600 leading-relaxed break-words">{section.content}</p>
                )}
                {section.items && (
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    {section.items.map((item, j) => (
                      <li key={j} className="break-words">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 space-y-6">
            {/* Contact card */}
            <div className="bg-stone-900 text-white p-6">
              <p className="text-xs tracking-widest text-amber-500 uppercase mb-4">Questions?</p>
              {buildingContact ? (
                <>
                  <p className="font-serif text-lg mb-1">{buildingContact.name}</p>
                  <p className="text-xs tracking-widest text-amber-600 uppercase mb-4">
                    El Dorado Lofts Management
                  </p>
                  {buildingContact.email && (
                    <p className="text-stone-300 text-sm mb-1">{buildingContact.email}</p>
                  )}
                  {buildingContact.phone && (
                    <p className="text-stone-300 text-sm">{buildingContact.phone}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-serif text-lg mb-1">Building Management</p>
                  <p className="text-xs tracking-widest text-amber-600 uppercase mb-4">
                    El Dorado Lofts Management
                  </p>
                  <p className="text-stone-300 text-sm">manager@eldoradolofts.com</p>
                </>
              )}
            </div>

            {/* Documents card */}
            <div className="border border-stone-200 p-6">
              <p className="text-xs tracking-widest text-amber-700 uppercase mb-3">Documents</p>
              <p className="text-stone-600 text-sm mb-4">
                Download the COI requirements, location agreement template, neighbor notice, and application to film.
              </p>
              <a
                href="/documents"
                className="inline-block border border-stone-900 text-stone-900 text-xs tracking-widest uppercase px-4 py-2 hover:bg-stone-900 hover:text-white transition-colors"
              >
                View Documents →
              </a>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  )
}
