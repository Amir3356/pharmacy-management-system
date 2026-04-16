import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import useMedicines from '../hooks/useMedicines'

function formatPercent(value, total) {
  if (!total) {
    return '0%'
  }

  return `${Math.round((value / total) * 100)}%`
}

function DonutChart({ data, total, centerLabel }) {
  const radius = 68
  const circumference = 2 * Math.PI * radius
  let offset = 0

  const centerValue = total.toLocaleString(undefined, { maximumFractionDigits: 0 })

  return (
    <div className="dashboard-donut-wrap">
      <svg viewBox="0 0 180 180" className="dashboard-donut" aria-hidden="true">
        <circle cx="90" cy="90" r={radius} className="dashboard-donut-track" />
        {data.map((segment) => {
          const length = total > 0 ? (segment.value / total) * circumference : 0
          const circle = (
            <circle
              key={segment.label}
              cx="90"
              cy="90"
              r={radius}
              className={`dashboard-donut-segment ${segment.tone}`}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
            />
          )

          offset += length
          return circle
        })}
      </svg>

      <div className="dashboard-donut-center">
        <strong>{centerValue}</strong>
        <span>{centerLabel}</span>
      </div>
    </div>
  )
}

function ChartBars({ items, showPercent = false }) {
  return (
    <div className="dashboard-bar-list">
      {items.map((item) => (
        <div className="dashboard-bar-row" key={item.label}>
          <div className="dashboard-bar-head">
            <strong>{item.label}</strong>
            <span>
              {item.value}
              {showPercent && item.total ? ` · ${formatPercent(item.value, item.total)}` : ''}
            </span>
          </div>
          <div className="dashboard-bar-track">
            <span style={{ width: `${item.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { medicines, loading, error, loadMedicines } = useMedicines()
  const [stockFilter, setStockFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    void loadMedicines('')
  }, [loadMedicines])

  const summary = useMemo(() => {
    const totalMedicines = medicines.length
    const totalStock = medicines.reduce((sum, medicine) => sum + (Number(medicine.quantity) || 0), 0)
    const lowStockItems = medicines.filter((medicine) => (Number(medicine.quantity) || 0) <= 10).length
    const categoryCount = new Set(medicines.map((medicine) => medicine.category)).size
    const inventoryValue = medicines.reduce(
      (sum, medicine) => sum + ((Number(medicine.price) || 0) * (Number(medicine.quantity) || 0)),
      0
    )

    const now = new Date()
    const expiringSoon = medicines.filter((medicine) => {
      if (!medicine.expiry_date) {
        return false
      }

      const expiry = new Date(medicine.expiry_date)
      if (Number.isNaN(expiry.getTime())) {
        return false
      }

      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
      return daysLeft >= 0 && daysLeft <= 30
    }).length

    return { totalMedicines, totalStock, lowStockItems, categoryCount, inventoryValue, expiringSoon }
  }, [medicines])

  const availableCategories = useMemo(
    () => ['all', ...new Set(medicines.map((medicine) => medicine.category).filter(Boolean))],
    [medicines]
  )

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const quantity = Number(medicine.quantity) || 0
      const stockMatches =
        stockFilter === 'all' ||
        (stockFilter === 'low' && quantity > 0 && quantity <= 10) ||
        (stockFilter === 'out' && quantity === 0) ||
        (stockFilter === 'healthy' && quantity > 10)

      const categoryMatches = categoryFilter === 'all' || medicine.category === categoryFilter

      return stockMatches && categoryMatches
    })
  }, [medicines, stockFilter, categoryFilter])

  const recentMedicines = filteredMedicines.slice(0, 5)
  const lowStockMedicines = medicines
    .filter((medicine) => (Number(medicine.quantity) || 0) <= 10)
    .slice(0, 5)

  const expiringSoonMedicines = useMemo(() => {
    const now = new Date()

    return medicines
      .map((medicine) => {
        const expiry = new Date(medicine.expiry_date)
        const daysLeft = Number.isNaN(expiry.getTime())
          ? Number.POSITIVE_INFINITY
          : Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

        return { ...medicine, daysLeft }
      })
      .filter((medicine) => medicine.daysLeft >= 0 && medicine.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5)
  }, [medicines])

  const categoryDistribution = useMemo(() => {
    const counts = medicines.reduce((map, medicine) => {
      const key = medicine.category || 'Uncategorized'
      map.set(key, (map.get(key) || 0) + 1)
      return map
    }, new Map())

    const entries = Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    const maxCount = entries[0]?.count || 1

    return entries.slice(0, 5).map((item) => ({
      ...item,
      percent: Math.round((item.count / maxCount) * 100),
    }))
  }, [medicines])

  const stockStatusData = useMemo(() => {
    const counts = medicines.reduce(
      (accumulator, medicine) => {
        const quantity = Number(medicine.quantity) || 0

        if (quantity === 0) {
          accumulator.out += 1
        } else if (quantity <= 10) {
          accumulator.low += 1
        } else {
          accumulator.healthy += 1
        }

        return accumulator
      },
      { healthy: 0, low: 0, out: 0 }
    )

    const total = counts.healthy + counts.low + counts.out || 1

    return [
      { label: 'Healthy', value: counts.healthy, tone: 'healthy', description: 'Above 10 units' },
      { label: 'Low stock', value: counts.low, tone: 'warning', description: '1 to 10 units' },
      { label: 'Out of stock', value: counts.out, tone: 'danger', description: 'Zero units' },
    ].map((item) => ({
      ...item,
      percent: Math.round((item.value / total) * 100),
      total,
    }))
  }, [medicines])

  const expiryBands = useMemo(() => {
    const bands = medicines.reduce(
      (accumulator, medicine) => {
        if (!medicine.expiry_date) {
          accumulator.unknown += 1
          return accumulator
        }

        const expiry = new Date(medicine.expiry_date)
        if (Number.isNaN(expiry.getTime())) {
          accumulator.unknown += 1
          return accumulator
        }

        const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24))

        if (daysLeft < 0) {
          accumulator.expired += 1
        } else if (daysLeft <= 7) {
          accumulator.week += 1
        } else if (daysLeft <= 30) {
          accumulator.month += 1
        } else {
          accumulator.safe += 1
        }

        return accumulator
      },
      { expired: 0, week: 0, month: 0, safe: 0, unknown: 0 }
    )

    const total = Object.values(bands).reduce((sum, value) => sum + value, 0) || 1

    return [
      { label: 'Expired', value: bands.expired, tone: 'danger', description: 'Past expiry date' },
      { label: '0-7 days', value: bands.week, tone: 'warning', description: 'Needs action now' },
      { label: '8-30 days', value: bands.month, tone: 'healthy', description: 'Watch this month' },
      { label: '30+ days', value: bands.safe, tone: 'healthy', description: 'Safe stock' },
      { label: 'Unknown', value: bands.unknown, tone: 'muted', description: 'No expiry available' },
    ].map((item) => ({
      ...item,
      percent: Math.round((item.value / total) * 100),
      total,
    }))
  }, [medicines])

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
            <span className="dashboard-meta-pill">Filtered {filteredMedicines.length}</span>
          </div>

          <div className="dashboard-quick-actions">
            <Link className="button" to="/medicines/new">Add medicine</Link>
            <Link className="button-secondary" to="/medicines">Open inventory</Link>
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
          <article className="dashboard-kpi">
            <span className="dashboard-kpi-label">Inventory value</span>
            <strong className="dashboard-kpi-value">
              {loading ? '...' : `$${summary.inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            </strong>
          </article>
          <article className="dashboard-kpi">
            <span className="dashboard-kpi-label">Expiring in 30 days</span>
            <strong className="dashboard-kpi-value">{loading ? '...' : summary.expiringSoon}</strong>
          </article>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <div className="dashboard-surface dashboard-filters">
        <div className="dashboard-filter-group">
          <label htmlFor="stockFilter">Stock status</label>
          <select id="stockFilter" className="input" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option value="all">All stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
            <option value="healthy">Healthy stock</option>
          </select>
        </div>

        <div className="dashboard-filter-group">
          <label htmlFor="categoryFilter">Category</label>
          <select
            id="categoryFilter"
            className="input"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="dashboard-filter-note">
          <strong>{filteredMedicines.length}</strong>
          <span>items in current view</span>
        </div>
      </div>

      <div className="dashboard-chart-grid">
        <Card className="dashboard-chart-card">
          <CardHeader className="dashboard-chart-header">
            <div>
              <CardTitle className="dashboard-chart-title">Stock status</CardTitle>
              <CardDescription>Healthy, low, and out-of-stock distribution.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="dashboard-chart-content">
            <DonutChart data={stockStatusData} total={summary.totalMedicines} centerLabel="medicines" />
            <div className="dashboard-chart-legend">
              {stockStatusData.map((item) => (
                <div className="dashboard-legend-item" key={item.label}>
                  <span className={`dashboard-legend-dot ${item.tone}`} />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.description}</p>
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-chart-card">
          <CardHeader className="dashboard-chart-header">
            <div>
              <CardTitle className="dashboard-chart-title">Category mix</CardTitle>
              <CardDescription>Top categories by item count.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="dashboard-chart-content">
            {categoryDistribution.length === 0 && !loading ? (
              <div className="empty-state dashboard-empty dashboard-chart-empty">
                <strong>No category data yet.</strong>
              </div>
            ) : (
              <ChartBars items={categoryDistribution} />
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-chart-card">
          <CardHeader className="dashboard-chart-header">
            <div>
              <CardTitle className="dashboard-chart-title">Expiry bands</CardTitle>
              <CardDescription>Risk window for upcoming stock reviews.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="dashboard-chart-content">
            <ChartBars items={expiryBands} showPercent />
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-insights-grid">
        <div className="dashboard-surface dashboard-panel">
          <div className="page-header">
            <div>
              <h2 className="section-title">Recent medicines</h2>
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
              <h2 className="section-title">Low stock focus</h2>
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

      <div className="dashboard-insights-grid">
        <div className="dashboard-surface dashboard-panel">
          <div className="page-header">
            <div>
              <h2 className="section-title">Expiry timeline (30 days)</h2>
            </div>
          </div>

          {expiringSoonMedicines.length === 0 && !loading ? (
            <div className="empty-state dashboard-empty">
              <strong>No near-expiry medicines.</strong>
              <p className="muted" style={{ marginTop: 8 }}>Everything is clear for the next 30 days.</p>
            </div>
          ) : (
            <ul className="dashboard-expiry-list">
              {expiringSoonMedicines.map((medicine) => (
                <li key={medicine.id}>
                  <div>
                    <strong>{medicine.name}</strong>
                    <p>{medicine.category || 'Uncategorized'}</p>
                  </div>
                  <span className={`badge ${medicine.daysLeft <= 7 ? 'danger' : 'warning'}`}>
                    {medicine.daysLeft} day{medicine.daysLeft === 1 ? '' : 's'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="dashboard-surface dashboard-panel">
          <div className="page-header">
            <div>
              <h2 className="section-title">Category mix</h2>
            </div>
          </div>

          {categoryDistribution.length === 0 && !loading ? (
            <div className="empty-state dashboard-empty">
              <strong>No category data yet.</strong>
            </div>
          ) : (
            <div className="dashboard-category-bars">
              {categoryDistribution.map((item) => (
                <div className="dashboard-category-row" key={item.category}>
                  <div className="dashboard-category-head">
                    <strong>{item.category}</strong>
                    <span>{item.count}</span>
                  </div>
                  <div className="dashboard-category-track">
                    <span style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}