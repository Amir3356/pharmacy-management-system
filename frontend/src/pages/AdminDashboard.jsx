import { useEffect, useState } from 'react'
import '../styles/admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalUsers: 0,
    lowStockMedicines: 0,
    expiredMedicines: 0
  })
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchMedicines()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/medicines')
      const data = await response.json()
      
      const lowStock = data.filter(m => m.quantity < 10).length
      const expired = data.filter(m => new Date(m.expiry_date) < new Date()).length
      
      setStats({
        totalMedicines: data.length,
        totalUsers: 1,
        lowStockMedicines: lowStock,
        expiredMedicines: expired
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/medicines')
      const data = await response.json()
      setMedicines(data.slice(0, 10))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching medicines:', error)
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Pharmacy Management System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon medicines">💊</div>
          <div className="stat-content">
            <h3>Total Medicines</h3>
            <p className="stat-number">{stats.totalMedicines}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon low-stock">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <p className="stat-number">{stats.lowStockMedicines}</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon expired">⛔</div>
          <div className="stat-content">
            <h3>Expired Medicines</h3>
            <p className="stat-number">{stats.expiredMedicines}</p>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="section">
          <h2>Recent Medicines</h2>
          
          {loading ? (
            <p className="loading">Loading...</p>
          ) : medicines.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(medicine => {
                  const expiryDate = new Date(medicine.expiry_date)
                  const isExpired = expiryDate < new Date()
                  const isLowStock = medicine.quantity < 10

                  return (
                    <tr key={medicine.id}>
                      <td>{medicine.name}</td>
                      <td>{medicine.dosage}</td>
                      <td>{medicine.quantity}</td>
                      <td>${medicine.price}</td>
                      <td>{expiryDate.toLocaleDateString()}</td>
                      <td>
                        {isExpired && <span className="badge danger">Expired</span>}
                        {isLowStock && !isExpired && <span className="badge warning">Low Stock</span>}
                        {!isExpired && !isLowStock && <span className="badge success">Available</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No medicines found</p>
          )}
        </div>
      </div>
    </div>
  )
}
