import { NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const links = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Stock summary and alerts',
  },
  {
    to: '/medicines',
    label: 'Medicines',
    description: 'View and search inventory',
  },
  {
    to: '/medicines/new',
    label: 'Add Medicine',
    description: 'Create a new medicine record',
  },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <p className="eyebrow">Workspace</p>
        <p className="section-title" style={{ fontSize: '1.15rem' }}>Beginner CRUD flow</p>
        <p className="muted" style={{ marginTop: 8 }}>{user?.email ?? 'admin@pharmacy.com'}</p>
        <p className="muted" style={{ marginTop: 8 }}>Use the links below to manage your pharmacy inventory.</p>
      </div>

      <nav className="sidebar-links" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span>
              <strong style={{ display: 'block' }}>{link.label}</strong>
              <span className="muted" style={{ fontSize: '0.9rem' }}>{link.description}</span>
            </span>
            <span aria-hidden="true">→</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}