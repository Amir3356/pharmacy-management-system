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
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
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