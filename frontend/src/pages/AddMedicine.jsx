import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MedicineForm from '../components/MedicineForm'
import { createMedicine } from '../services/api'

export default function AddMedicine() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (values) => {
    setBusy(true)
    setError('')

    try {
      await createMedicine(values)
      navigate('/medicines', { state: { message: 'Medicine added successfully.' } })
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? 'Unable to add the medicine.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Create</p>
          <h2 className="section-title">Add medicine</h2>
          <p className="section-subtitle">Register a new medicine in the inventory.</p>
        </div>
      </div>

      {error ? <div className="alert error" style={{ marginBottom: 16 }}>{error}</div> : null}

      <MedicineForm submitLabel="Create medicine" busy={busy} onSubmit={handleSubmit} />
    </section>
  )
}