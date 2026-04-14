import useAuth from '../hooks/useAuth'

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
            <button className="button-ghost" type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <div className="topbar-chip">React + Laravel API</div>
        )}
      </div>
    </header>
  )
}