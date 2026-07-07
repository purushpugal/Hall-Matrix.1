import { Outlet, Link, useLocation } from 'react-router-dom'
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { CollegeSettingsProvider } from '../../context/CollegeSettingsContext'

export default function TutorLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <CollegeSettingsProvider>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar bg="white" expand="lg" className="border-bottom shadow-sm px-4 py-2 sticky-top z-3">
          <Navbar.Brand as={Link} to="/tutor/dashboard" className="fw-bold text-primary d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill fs-4"></i> Tutor Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="tutor-navbar-nav" />
          <Navbar.Collapse id="tutor-navbar-nav">
            <Nav className="me-auto ms-4 gap-2">
              <Nav.Link 
                as={Link} 
                to="/tutor/dashboard" 
                className={`px-3 py-2 rounded fw-medium ${location.pathname.includes('/tutor/dashboard') ? 'bg-primary text-white' : 'text-dark ca-nav-link'}`}
              >
                <i className="bi bi-people-fill me-2"></i>My Students
              </Nav.Link>
            </Nav>
            <div className="d-flex align-items-center gap-3">
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="user-dropdown" className="d-flex align-items-center gap-2 border-0 bg-transparent fw-medium">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {user?.name}
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow border-0 mt-2">
                  <Dropdown.Header>{user?.email}</Dropdown.Header>
                  <Dropdown.Item onClick={logout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Navbar>

        <Container fluid className="flex-grow-1 p-4" style={{ maxWidth: 1400 }}>
          <Outlet />
        </Container>
      </div>
    </CollegeSettingsProvider>
  )
}
