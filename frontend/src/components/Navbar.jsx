import useAuth from '../hooks/useAuth'
import { Button } from './ui/button'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="topbar">
      <div>
        <h1>Pharmacy Management System</h1>
        <p className="muted">Simple CRUD for medicines, stock, and expiry tracking.</p>
      </div>

      <div className="inline-actions">
        {isAuthenticated ? (
          <>
            <div className="topbar-chip">{user?.name ?? 'Signed in'}</div>
            <Button variant="ghost" type="button" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <div className="topbar-chip">React + Laravel API</div>
        )}
      </div>
    </header>
  )
}