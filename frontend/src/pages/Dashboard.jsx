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
  const lowStockMedicines = medicines.filter((medicine) => (Number(medicine.quantity) || 0) <= 10).slice(0, 5)
  const updatedAt = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <section className="dashboard-v2">
      <div className="dashboard-surface dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">Inventory studio</p>
          <h2 className="section-title">Pharmacy command center</h2>
          <p className="section-subtitle">A cleaner live view of stock health, movement, and attention areas.</p>
          <div className="dashboard-hero-meta">
            <span className="dashboard-meta-pill">Live inventory</span>
            <span className="dashboard-meta-pill">Updated {updatedAt}</span>
          </div>
        </div>

        <div className="dashboard-kpi-grid">
          <article className="dashboard-kpi">
            <span className="dashboard-kpi-label">Total medicines</span>
            <strong className="dashboard-kpi-value">{loading ? '...' : summary.totalMedicines}</strong>
          </article>
          <article className="dashboard-kpi">
            <span className="dashboard-kpi-label">Units in stock</span>
            <strong className="dashboard-kpi-value">{loading ? '...' : summary.totalStock}</strong>
          </article>
          <article className="dashboard-kpi">
            <span className="dashboard-kpi-label">Low stock alerts</span>
            <strong className="dashboard-kpi-value">{loading ? '...' : summary.lowStockItems}</strong>
          </article>
          <article className="dashboard-kpi">
            <span className="dashboard-kpi-label">Tracked categories</span>
            <strong className="dashboard-kpi-value">{loading ? '...' : summary.categoryCount}</strong>
          </article>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <div className="dashboard-insights-grid">
        <div className="dashboard-surface dashboard-panel">
          <div className="page-header">
            <div>
              <p className="eyebrow">Latest entries</p>
              <h2 className="section-title">Recent medicines</h2>
              <p className="section-subtitle">Most recently loaded medicines from your inventory.</p>
            </div>
          </div>

          {recentMedicines.length === 0 && !loading ? (
            <div className="empty-state dashboard-empty">
              <strong>No medicines yet.</strong>
              <p className="muted" style={{ marginTop: 8 }}>Add your first medicine to start tracking stock.</p>
            </div>
          ) : (
            <div className="dashboard-recent-list">
              {recentMedicines.map((medicine) => (
                <article className="dashboard-recent-item" key={medicine.id}>
                  <div className="dashboard-recent-content">
                    <h3>{medicine.name}</h3>
                    <p className="muted">{medicine.description || 'No description provided.'}</p>
                  </div>
                  <div className="dashboard-recent-meta">
                    <span className="tag">{medicine.category}</span>
                    <span className={`badge ${Number(medicine.quantity) <= 10 ? 'warning' : 'success'}`}>
                      Qty {medicine.quantity}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="dashboard-surface dashboard-panel dashboard-watchlist">
          <div className="page-header">
            <div>
              <p className="eyebrow">Watchlist</p>
              <h2 className="section-title">Low stock focus</h2>
              <p className="section-subtitle">These items need restocking attention soon.</p>
            </div>
          </div>

          {lowStockMedicines.length === 0 && !loading ? (
            <div className="empty-state dashboard-empty">
              <strong>Great inventory balance.</strong>
              <p className="muted" style={{ marginTop: 8 }}>No low stock items right now.</p>
            </div>
          ) : (
            <ul className="dashboard-watch-items">
              {lowStockMedicines.map((medicine) => (
                <li key={medicine.id}>
                  <div>
                    <strong>{medicine.name}</strong>
                    <p>{medicine.category}</p>
                  </div>
                  <span className="badge warning">{medicine.quantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </section>
  )
}