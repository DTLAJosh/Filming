import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ units: 0, published: 0, hidden: 0, users: 0, docs: 0, testimonials: 0 })

  useEffect(() => {
    async function loadStats() {
      const [unitsRes, usersRes, docsRes, testimonialRes] = await Promise.all([
        supabase.from('units').select('status, admin_hidden'),
        supabase.from('profiles').select('id'),
        supabase.from('documents').select('id'),
        supabase.from('testimonials').select('id'),
      ])
      const units = unitsRes.data || []
      setStats({
        units: units.length,
        published: units.filter(u => u.status === 'published' && !u.admin_hidden).length,
        hidden: units.filter(u => u.admin_hidden).length,
        users: (usersRes.data || []).length,
        docs: (docsRes.data || []).length,
        testimonials: (testimonialRes.data || []).length,
      })
    }
    loadStats()
  }, [])

  const tiles = [
    { label: 'Total Units', value: stats.units, to: '/admin/units' },
    { label: 'Published', value: stats.published, to: '/admin/units' },
    { label: 'Admin-Hidden', value: stats.hidden, to: '/admin/units' },
    { label: 'Users', value: stats.users, to: '/admin/users' },
    { label: 'Documents', value: stats.docs, to: '/admin/documents' },
    { label: 'Testimonials', value: stats.testimonials, to: '/admin/testimonials' },
  ]

  const quickLinks = [
    { to: '/admin/units', label: 'Manage Units' },
    { to: '/admin/documents', label: 'Manage Documents' },
    { to: '/admin/guidelines', label: 'Edit Guidelines' },
    { to: '/admin/testimonials', label: 'Manage Testimonials' },
    { to: '/admin/contact', label: 'Edit Building Contact' },
    { to: '/admin/users', label: 'View Users' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-display text-4xl text-ed-black mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {tiles.map(t => (
            <Link key={t.label} to={t.to} className="bg-white border border-ed-cream p-6 hover:border-ed-gold/50 transition-colors">
              <p className="font-display text-4xl text-ed-black mb-1">{t.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ed-stone">{t.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="bg-white border border-ed-cream p-6">
          <p className="eyebrow mb-5">Quick Actions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickLinks.map(l => (
              <Link key={l.to} to={l.to} className="block px-4 py-3 border border-ed-cream hover:border-ed-gold/50 font-body text-sm text-ed-mid hover:text-ed-gold transition-colors">
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
