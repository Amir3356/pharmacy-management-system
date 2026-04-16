import { NavLink } from 'react-router-dom'

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
  {
    to: '/admin/dashboard',
    label: 'Admin Dashboard',
    description: 'View system statistics',
  },
  {
    to: '/admin/panel',
    label: 'Admin Panel',
    description: 'Manage users and settings',
  },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <p className="eyebrow">Navigation</p>
      </div>

      <nav className="sidebar-links" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-copy">
              <strong className="sidebar-label">{link.label}</strong>
              <span className="muted sidebar-description">{link.description}</span>
            </span>
            <span aria-hidden="true" className="sidebar-arrow">→</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}