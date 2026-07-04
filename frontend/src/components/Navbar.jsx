import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap'

export default function Navbar({ onLoginClick, onRegisterClick }) {
  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container fluid="xl">
        <BSNavbar.Brand href="#" className="navbar-brand-text">
          <i className="bi bi-grid-3x3-gap-fill text-warning me-2"></i>
          Hall Matrix
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-nav" />

        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#how-it-works">How It Works</Nav.Link>
            <Nav.Link href="#benefits">Benefits</Nav.Link>
          </Nav>

          <div className="d-flex gap-2 mt-2 mt-lg-0">
            <Button variant="outline-light" size="sm" onClick={onLoginClick}>
              <i className="bi bi-box-arrow-in-right me-1"></i>Login
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="fw-semibold btn-register-college"
              onClick={onRegisterClick}
            >
              <i className="bi bi-building-add me-1"></i>Register College
            </Button>
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}
