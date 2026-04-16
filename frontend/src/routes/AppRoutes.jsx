import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import RequireAuth from '../components/RequireAuth'
import Sidebar from '../components/Sidebar'
import AddMedicine from '../pages/AddMedicine'
import AdminDashboard from '../pages/AdminDashboard'
import AdminPanel from '../pages/AdminPanel'
import Dashboard from '../pages/Dashboard'
import EditMedicine from '../pages/EditMedicine'
import Login from '../pages/Login'
import Medicines from '../pages/Medicines'
import useAuth from '../hooks/useAuth'

export default function AppRoutes() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const flashMessage = location.state?.message ?? ''

  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      </Routes>
    )
  }

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route
          path="/*"
          element={
            <RequireAuth>
              <div className="app-grid">
                <Sidebar />

                <main className="content-panel">
                  {flashMessage ? <div className="alert success">{flashMessage}</div> : null}

                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/medicines" element={<Medicines />} />
                    <Route path="/medicines/new" element={<AddMedicine />} />
                    <Route path="/medicines/:id/edit" element={<EditMedicine />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/panel" element={<AdminPanel />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  )
}