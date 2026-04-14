import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MedicineCard from '../components/MedicineCard'
import SearchBar from '../components/SearchBar'
import { Button } from '../components/ui/button'
import useMedicines from '../hooks/useMedicines'

export default function Medicines() {
  const navigate = useNavigate()
  const { medicines, loading, error, search, setSearch, loadMedicines, removeMedicine } = useMedicines()
  const [message, setMessage] = useState('')

  useEffect(() => {
    void loadMedicines('')
  }, [loadMedicines])

  const handleSearch = (event) => {
    event.preventDefault()
    void loadMedicines(search.trim())
  }

  const handleClear = () => {
    setSearch('')
    void loadMedicines('')
  }

  const handleEdit = (medicine) => {
    navigate(`/medicines/${medicine.id}/edit`)
  }

  const handleDelete = async (medicine) => {
    const confirmDelete = window.confirm(`Delete ${medicine.name}?`)
    if (!confirmDelete) {
      return
    }

    await removeMedicine(medicine.id)
    setMessage(`${medicine.name} was deleted successfully.`)
  }

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2 className="section-title">Medicines list</h2>
          <p className="section-subtitle">Search, review stock levels, and manage records from one place.</p>
        </div>

        <div className="page-actions">
          <Button type="button" onClick={() => navigate('/medicines/new')}>
            Add medicine
          </Button>
        </div>
      </div>

      <SearchBar
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onSubmit={handleSearch}
        onClear={handleClear}
      />

      {message ? <div className="alert success" style={{ marginTop: 16 }}>{message}</div> : null}
      {error ? <div className="alert error" style={{ marginTop: 16 }}>{error}</div> : null}

      <div style={{ marginTop: 18 }}>
        {loading ? <div className="empty-state">Loading medicines...</div> : null}

        {!loading && medicines.length === 0 ? (
          <div className="empty-state">
            <strong>No medicines found.</strong>
            <p className="muted" style={{ marginTop: 8 }}>Add a medicine or try a different search term.</p>
          </div>
        ) : null}

        <div className="medicine-grid" style={{ marginTop: medicines.length ? 0 : 18 }}>
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </section>
  )
}