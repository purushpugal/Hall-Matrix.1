import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './superadmin.css'

const NAV_ITEMS = [
  { to: '/super-admin/dashboard', icon: 'bi-speedometer2',   label: 'Dashboard' },
  { to: '/super-admin/colleges',  icon: 'bi-building',        label: 'Colleges' },
  { to: '/super-admin/users',     icon: 'bi-people-fill',     label: 'Users' },
  { to: '/super-admin/halls',     icon: 'bi-grid-3x3-gap',    label: 'Halls' },
  { to: '/super-admin/exams',     icon: 'bi-journal-text',    label: 'Exams' },
  { to: '/super-admin/reports',   icon: 'bi-bar-chart-fill',  label: 'Reports' },
  { to: '/super-admin/settings',  icon: 'bi-gear-fill',       label: 'Settings' },
]

export default function SuperAdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="sa-wrapper">
      {/* Sidebar */}
      <aside className={`sa-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sa-brand">
          <i className="bi bi-grid-3x3-gap-fill text-warning fs-4"></i>
          {sidebarOpen && <span className="ms-2 fw-bold">Hall Matrix</span>}
        </div>

        <nav className="sa-nav">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sa-nav-item${isActive ? ' active' : ''}`}>
              <i className={`bi ${icon}`}></i>
              {sidebarOpen && <span className="ms-2">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sa-sidebar-footer">
          <button className="sa-nav-item text-danger border-0 bg-transparent w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            {sidebarOpen && <span className="ms-2">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="sa-main">
        {/* Topbar */}
        <header className="sa-topbar">
          <button className="btn btn-sm btn-light me-3" onClick={() => setSidebarOpen(v => !v)}>
            <i className={`bi bi-layout-sidebar${sidebarOpen ? '' : '-reverse'}`}></i>
          </button>
          <span className="fw-semibold text-muted d-none d-md-inline">Super Admin Panel</span>

          <div className="ms-auto d-flex align-items-center gap-3">
            <div className="d-none d-sm-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 34, height: 34, fontSize: 14 }}
              >
                {user?.name?.[0]?.toUpperCase() ?? 'S'}
              </div>
              <div className="lh-sm">
                <div className="small fw-semibold">{user?.name}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>Super Admin</div>
              </div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-power me-1"></i>Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="sa-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
