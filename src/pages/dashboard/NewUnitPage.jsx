import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import UnitForm from '../../components/units/UnitForm'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

export default function NewUnitPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async (formData, newPhotos) => {
    setSaving(true)
    setError(null)
    try {
      const { data: unit, error: unitError } = await supabase
        .from('units')
        .insert({ ...formData, owner_id: user.id })
        .select()
        .single()

      if (unitError) throw unitError

      // Save photos
      if (newPhotos.length > 0) {
        await supabase.from('unit_photos').insert(
          newPhotos.map((url, i) => ({
            unit_id: unit.id,
            image_url: url,
            sort_order: i,
          }))
        )
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ed-stone mb-1">
          Homeowner Portal
        </p>
        <h1 className="font-display text-4xl text-ed-black mb-8">Add New Unit</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body mb-6">
            {error}
          </div>
        )}

        <UnitForm onSave={handleSave} isLoading={saving} />
      </div>
    </DashboardLayout>
  )
}
