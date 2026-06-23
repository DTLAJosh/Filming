import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import UnitForm from '../../components/units/UnitForm'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

export default function EditUnitPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [unit, setUnit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('units')
      .select('*, unit_photos(*)')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single()
      .then(({ data }) => {
        setUnit(data)
        setLoading(false)
      })
  }, [id, user])

  const handleSave = async (formData, newPhotos) => {
    setSaving(true)
    setError(null)
    try {
      const { error: unitError } = await supabase
        .from('units')
        .update(formData)
        .eq('id', id)

      if (unitError) throw unitError

      if (newPhotos.length > 0) {
        const maxOrder = unit.unit_photos?.length || 0
        await supabase.from('unit_photos').insert(
          newPhotos.map((url, i) => ({
            unit_id: id,
            image_url: url,
            sort_order: maxOrder + i,
          }))
        )
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="p-8 font-display text-2xl italic text-ed-mid">Loading…</div>
    </DashboardLayout>
  )

  if (!unit) return (
    <DashboardLayout>
      <div className="p-8">
        <p className="font-display text-2xl text-ed-mid">Unit not found or you don't have access.</p>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ed-stone mb-1">
          Homeowner Portal
        </p>
        <h1 className="font-display text-4xl text-ed-black mb-2">Edit Listing</h1>
        <p className="font-body text-sm text-ed-mid mb-8">{unit.title}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body mb-6">
            {error}
          </div>
        )}

        <UnitForm initialData={unit} onSave={handleSave} isLoading={saving} />
      </div>
    </DashboardLayout>
  )
}
