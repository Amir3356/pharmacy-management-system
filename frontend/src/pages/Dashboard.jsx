import { useEffect, useMemo } from 'react'
import useMedicines from '../hooks/useMedicines'

export default function Dashboard() {
  const { medicines, loading, error, loadMedicines } = useMedicines()

  useEffect(() => {
    void loadMedicines('')
  }, [loadMedicines])

  const summary = useMemo(() => {
    const totalMedicines = medicines.length
    const totalStock = medicines.reduce((sum, medicine) => sum + (Number(medicine.quantity) || 0), 0)
    const lowStockItems = medicines.filter((medicine) => (Number(medicine.quantity) || 0) <= 10).length
    const categoryCount = new Set(medicines.map((medicine) => medicine.category)).size

    return { totalMedicines, totalStock, lowStockItems, categoryCount }
  }, [medicines])

  const recentMedicines = medicines.slice(0, 4)

  return (
    <section className="content-panel">
      <div className="page-card">
        <div className="page-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h2 className="section-title">Stock dashboard</h2>
            <p className="section-subtitle">Quick snapshot of inventory, low stock items, and upcoming expiries.</p>
          </div>
        </div>

        {error ? <div className="alert error">{error}</div> : null}

        <div className="stats-grid" style={{ marginTop: 18 }}>
          <div className="stat-card">
            <span>Total medicines</span>
            <strong>{loading ? '...' : summary.totalMedicines}</strong>
          </div>
          <div className="stat-card">
            <span>Total stock</span>
            <strong>{loading ? '...' : summary.totalStock}</strong>
          </div>
          <div className="stat-card">
            <span>Low stock items</span>
            <strong>{loading ? '...' : summary.lowStockItems}</strong>
          </div>
          <div className="stat-card">
            <span>Categories tracked</span>
            <strong>{loading ? '...' : summary.categoryCount}</strong>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div className="page-header">
          <div>
            <h2 className="section-title">Recent medicines</h2>
            <p className="section-subtitle">The newest items loaded from the API.</p>
          </div>
        </div>

        {recentMedicines.length === 0 && !loading ? (
          <div className="empty-state">
            <strong>No medicines yet.</strong>
            <p className="muted" style={{ marginTop: 8 }}>Add your first medicine to start tracking stock.</p>
          </div>
        ) : (
          <div className="medicine-grid">
            {recentMedicines.map((medicine) => (
              <article className="medicine-card" key={medicine.id}>
                <header>
                  <div>
                    <h3>{medicine.name}</h3>
                    <div className="tag-row">
                      <span className="tag">{medicine.category}</span>
                    </div>
                  </div>
                  <span className={`badge ${Number(medicine.quantity) <= 10 ? 'warning' : 'success'}`}>
                    Qty {medicine.quantity}
                  </span>
                </header>
                <p className="muted">{medicine.description || 'No description provided.'}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}