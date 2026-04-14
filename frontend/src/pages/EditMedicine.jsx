import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MedicineForm from '../components/MedicineForm'
import { fetchMedicine, updateMedicine } from '../services/api'

export default function EditMedicine() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [medicine, setMedicine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    const loadMedicine = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await fetchMedicine(id)
        if (isActive) {
          setMedicine(data)
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError?.response?.data?.message ?? 'Unable to load the medicine.')
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadMedicine()

    return () => {
      isActive = false
    }
  }, [id])

  const handleSubmit = async (values) => {
    setBusy(true)
    setError('')

    try {
      await updateMedicine(id, values)
      navigate('/medicines', { state: { message: 'Medicine updated successfully.' } })
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? 'Unable to update the medicine.')
    } finally {
      setBusy(false)
    }
  }

  const initialValues = useMemo(() => {
    if (!medicine) {
      return undefined
    }

    return {
      ...medicine,
      price: String(medicine.price ?? ''),
      quantity: String(medicine.quantity ?? ''),
      expiry_date: medicine.expiry_date ?? '',
    }
  }, [medicine])

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Update</p>
          <h2 className="section-title">Edit medicine</h2>
          <p className="section-subtitle">Adjust the details and keep stock information current.</p>
        </div>
      </div>

      {loading ? <div className="empty-state">Loading medicine...</div> : null}
      {!loading && error ? <div className="alert error">{error}</div> : null}

      {!loading && medicine ? (
        <MedicineForm
          initialValues={initialValues}
          submitLabel="Update medicine"
          busy={busy}
          onSubmit={handleSubmit}
        />
      ) : null}
    </section>
  )
}