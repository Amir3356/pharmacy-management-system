import { useState, useEffect } from 'react'
import '../styles/admin.css'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(Array.isArray(data) ? data : data.data || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        setNewUser({ name: '', email: '', password: '' })
        setShowAddUser(false)
        fetchUsers()
      }
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ System Settings
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Manage Users</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddUser(!showAddUser)}
            >
              {showAddUser ? '✕ Cancel' : '+ Add New User'}
            </button>
          </div>

          {showAddUser && (
            <form className="form-card" onSubmit={handleAddUser}>
              <h3>Add New User</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Create User</button>
            </form>
          )}

          {loading ? (
            <p className="loading">Loading users...</p>
          ) : users.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No users found</p>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="tab-content">
          <h2>System Settings</h2>
          <div className="settings-card">
            <h3>Application Information</h3>
            <p><strong>Application Name:</strong> Pharmacy Management System</p>
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Database:</strong> MariaDB</p>
            <p><strong>Framework:</strong> Laravel + React</p>
          </div>

          <div className="settings-card">
            <h3>Admin Functions</h3>
            <button className="btn btn-secondary">📊 Generate Reports</button>
            <button className="btn btn-secondary">🔄 Backup Database</button>
            <button className="btn btn-secondary">🔍 View Logs</button>
          </div>
        </div>
      )}
    </div>
  )
}
