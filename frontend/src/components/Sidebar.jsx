import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/medicines', label: 'Medicines' },
  { to: '/medicines/new', label: 'Add Medicine' },
]

const adminLinks = [
  { to: '/admin/dashboard', label: 'Admin Dashboard' },
  { to: '/admin/panel', label: 'Admin Panel' },
]

const supportLinks = [
  { to: '/dashboard', label: 'Help Center' },
  { to: '/dashboard', label: 'Documentation' },
]

function NavGroup({ title, links, onNavigate }) {
  return (
    <section className="sidebar-group">
      <p className="sidebar-group-title">{title}</p>
      <nav className="sidebar-links" aria-label={title}>
        {links.map((link) => (
          <NavLink
            key={`${title}-${link.to}-${link.label}`}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon" aria-hidden="true" />
            <span className="sidebar-copy">
              <strong className="sidebar-label">{link.label}</strong>
            </span>
          </NavLink>
        ))}
      </nav>
    </section>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const initials = (user?.username || 'User').slice(0, 2).toUpperCase()

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar navigation"
      >
        Menu
      </button>

      {isOpen ? <button type="button" className="sidebar-overlay" aria-label="Close sidebar" onClick={() => setIsOpen(false)} /> : null}

      <aside className={`sidebar sidebar-07 ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-mark" aria-hidden="true">Rx</div>
          <div>
            <p className="sidebar-brand-title">Pharmacy OS</p>
            <p className="sidebar-brand-subtitle">Inventory workspace</p>
          </div>
        </div>

        <div className="sidebar-scroll">
          <NavGroup title="Platform" links={mainLinks} onNavigate={() => setIsOpen(false)} />
          <NavGroup title="Administration" links={adminLinks} onNavigate={() => setIsOpen(false)} />
          <NavGroup title="Resources" links={supportLinks} onNavigate={() => setIsOpen(false)} />
        </div>

        <div className="sidebar-user-card">
          <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
          <div>
            <p className="sidebar-user-name">{user?.username || 'Signed in user'}</p>
            <p className="sidebar-user-role">Administrator</p>
          </div>
        </div>
      </aside>
    </>
  )
}