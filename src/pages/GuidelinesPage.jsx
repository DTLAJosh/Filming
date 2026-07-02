import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import PublicLayout from '../components/layout/PublicLayout'
import { supabase } from '../lib/supabase'
import { DEFAULT_GUIDELINES_MARKDOWN, DEFAULT_GUIDELINES_TITLE } from '../data/guidelines'

export default function GuidelinesPage() {
  const [buildingContact, setBuildingContact] = useState(null)
  const [guidelines, setGuidelines] = useState({
    title: DEFAULT_GUIDELINES_TITLE,
    content: DEFAULT_GUIDELINES_MARKDOWN,
  })

  useEffect(() => {
    async function load() {
      const [{ data: contactData }, { data: guidelinesData }] = await Promise.all([
        supabase
        .from('building_contact')
        .select('name, title, email, phone')
        .limit(1)
          .single(),
        supabase
          .from('filming_guidelines')
          .select('title, content')
          .order('created_at')
          .limit(1)
          .single(),
      ])

      if (contactData) setBuildingContact(contactData)
      if (guidelinesData?.content) {
        setGuidelines({
          title: guidelinesData.title || DEFAULT_GUIDELINES_TITLE,
          content: guidelinesData.content,
        })
      }
    }
    load()
  }, [])

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-stone-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-widest text-amber-500 uppercase mb-3">For Productions</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{guidelines.title}</h1>
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
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="font-serif text-xl text-stone-900 mb-3 mt-10 first:mt-0 pb-2 border-b border-stone-200">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-stone-600 leading-relaxed break-words mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 text-stone-600 mb-4">{children}</ul>
                ),
                li: ({ children }) => <li className="break-words">{children}</li>,
                hr: () => <div className="h-6" />,
                strong: ({ children }) => <strong className="font-semibold text-stone-800">{children}</strong>,
              }}
            >
              {guidelines.content}
            </ReactMarkdown>
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
