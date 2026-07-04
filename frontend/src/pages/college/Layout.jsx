import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CollegeSettingsProvider } from '../../context/CollegeSettingsContext'
import './college.css'

// ── Navigation tree ───────────────────────────────────────────────────────────
const NAV = [
  {
    id: 'dashboard',
    to: '/college/dashboard',
    icon: 'bi-speedometer2',
    label: 'Dashboard',
  },
  {
    id: 'employee',
    icon: 'bi-people-fill',
    label: 'Employee Mang',
    match: '/college/employee',
    children: [
      { to: '/college/employee/add',  icon: 'bi-person-plus-fill', label: 'Add'  },
      { to: '/college/employee/list', icon: 'bi-list-ul',           label: 'List' },
    ],
  },
  {
    id: 'student',
    icon: 'bi-person-lines-fill',
    label: 'Student Mang',
    match: '/college/student',
    children: [
      { to: '/college/student/add',  icon: 'bi-person-plus-fill', label: 'Add'  },
      { to: '/college/student/list', icon: 'bi-list-ul',           label: 'List' },
      {
        id: 'student-settings',
        icon: 'bi-gear-fill',
        label: 'Settings',
        match: '/college/student/settings',
        children: [
          { to: '/college/student/settings/degree',     icon: 'bi-mortarboard-fill',  label: 'Degree'     },
          { to: '/college/student/settings/department', icon: 'bi-diagram-2-fill',    label: 'Department' },
          { to: '/college/student/settings/batch',      icon: 'bi-calendar-range-fill',label: 'Batch'     },
          { to: '/college/student/settings/subjects',   icon: 'bi-book-fill',         label: 'Subjects'   },
          { to: '/college/student/settings/semesters',  icon: 'bi-layers-fill',       label: 'Semesters'  },
        ],
      },
    ],
  },
  {
    id: 'hall',
    icon: 'bi-grid-3x3-gap-fill',
    label: 'Hall Manag',
    match: '/college/hall',
    children: [
      { to: '/college/hall/add',  icon: 'bi-plus-square-fill', label: 'Add'  },
      { to: '/college/hall/list', icon: 'bi-list-ul',           label: 'List' },
    ],
  },
  {
    id: 'exam',
    icon: 'bi-journal-text',
    label: 'Exam Schedule',
    match: '/college/exam',
    children: [
      { to: '/college/exam/add',  icon: 'bi-plus-square-fill', label: 'Add'  },
      { to: '/college/exam/list', icon: 'bi-list-ul',           label: 'List' },
    ],
  },
  {
    id: 'reports',
    to: '/college/reports',
    icon: 'bi-bar-chart-fill',
    label: 'Reports',
  },
]

// ── Sibling map: for accordion behavior, opening a submenu closes its siblings ─
function buildSiblingMap(items) {
  const map = {}
  function walk(list) {
    const parentIds = list.filter(i => i.children).map(i => i.id)
    parentIds.forEach(id => { map[id] = parentIds.filter(pid => pid !== id) })
    list.forEach(i => { if (i.children) walk(i.children) })
  }
  walk(items)
  return map
}
const SIBLING_MAP = buildSiblingMap(NAV)

// ── Sidebar nav items ─────────────────────────────────────────────────────────
function NavItem({ item, depth = 0, open, onToggle, sidebarOpen }) {
  // Leaf node → plain NavLink
  if (item.to) {
    return (
      <NavLink
        to={item.to}
        title={!sidebarOpen ? item.label : undefined}
        className={({ isActive }) =>
          `ca-nav-item depth-${depth}${isActive ? ' active' : ''}`
        }
      >
        <i className={`bi ${item.icon}`}></i>
        {sidebarOpen && <span className="nav-label">{item.label}</span>}
      </NavLink>
    )
  }

  // Parent node → accordion toggle
  const isOpen = open.has(item.id)

  return (
    <>
      <button
        className={`ca-nav-item ca-nav-parent depth-${depth}${isOpen ? ' parent-open' : ''}`}
        onClick={() => sidebarOpen && onToggle(item.id)}
        title={!sidebarOpen ? item.label : undefined}
      >
        <i className={`bi ${item.icon}`}></i>
        {sidebarOpen && (
          <>
            <span className="nav-label">{item.label}</span>
            <i className={`bi bi-chevron-right ms-auto nav-arrow${isOpen ? ' rotated' : ''}`}></i>
          </>
        )}
      </button>

      {sidebarOpen && isOpen && (
        <div className="ca-sub-menu">
          {item.children.map(child => (
            <NavItem
              key={child.id ?? child.to}
              item={child}
              depth={depth + 1}
              open={open}
              onToggle={onToggle}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </div>
      )}
    </>
  )
}

// ── Determine which parent IDs should be open based on current path ───────────
function defaultOpen(pathname) {
  const set = new Set()
  if (pathname.startsWith('/college/employee'))        set.add('employee')
  if (pathname.startsWith('/college/student'))         set.add('student')
  if (pathname.startsWith('/college/student/settings'))set.add('student-settings')
  if (pathname.startsWith('/college/hall'))            set.add('hall')
  if (pathname.startsWith('/college/exam'))            set.add('exam')
  return set
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function CollegeLayout() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [open, setOpen] = useState(() => defaultOpen(location.pathname))

  // Auto-expand when navigating directly to a deep route
  useEffect(() => {
    setOpen(prev => new Set([...prev, ...defaultOpen(location.pathname)]))
  }, [location.pathname])

  function toggleMenu(id) {
    setOpen(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        SIBLING_MAP[id]?.forEach(siblingId => next.delete(siblingId))
      }
      return next
    })
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="ca-wrapper">
      {/* ── Sidebar ── */}
      <aside className={`ca-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>

        {/* Brand */}
        <div className="ca-brand">
          <i className="bi bi-grid-3x3-gap-fill text-warning fs-5 flex-shrink-0"></i>
          {sidebarOpen && <span className="ms-2 fw-bold">Hall Matrix</span>}
        </div>

        {/* College badge */}
        {sidebarOpen && (
          <div className="ca-college-badge">
            <div className="ca-college-icon">
              <i className="bi bi-building-fill"></i>
            </div>
            <div className="ca-college-info">
              <div className="ca-college-name">College Admin</div>
              <div className="ca-college-sub">Exam Management</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="ca-nav">
          {NAV.map(item => (
            <NavItem
              key={item.id}
              item={item}
              depth={0}
              open={open}
              onToggle={toggleMenu}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="ca-sidebar-footer">
          <button className="ca-nav-item ca-logout-btn" onClick={handleLogout} title="Logout">
            <i className="bi bi-box-arrow-left"></i>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ca-main">
        {/* Topbar */}
        <header className="ca-topbar">
          <button className="btn btn-sm btn-light me-3" onClick={() => setSidebarOpen(v => !v)}>
            <i className={`bi bi-layout-sidebar${sidebarOpen ? '' : '-reverse'}`}></i>
          </button>
          <span className="fw-semibold text-muted d-none d-md-inline">College Admin Panel</span>

          <div className="ms-auto d-flex align-items-center gap-3">
            <div className="d-none d-sm-flex align-items-center gap-2">
              <div className="ca-avatar">
                {user?.name?.[0]?.toUpperCase() ?? 'C'}
              </div>
              <div className="lh-sm">
                <div className="small fw-semibold">{user?.name}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>College Admin</div>
              </div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-power me-1"></i>Logout
            </button>
          </div>
        </header>

        <main className="ca-content">
          <CollegeSettingsProvider>
            <Outlet />
          </CollegeSettingsProvider>
        </main>
      </div>
    </div>
  )
}
