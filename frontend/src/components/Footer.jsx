import { Container, Row, Col } from 'react-bootstrap'

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <Container fluid="xl">
        <Row className="g-4 mb-4">
          <Col md={5}>
            <h5 className="fw-bold mb-2">
              <i className="bi bi-grid-3x3-gap-fill text-warning me-2"></i>Hall Matrix
            </h5>
            <p className="text-white-50 small mb-0" style={{ maxWidth: 320 }}>
              The smart exam hall seat allocation platform for colleges — saving time,
              reducing errors, and ensuring fair exam seating automatically.
            </p>
          </Col>
          <Col md={3}>
            <h6 className="fw-semibold mb-3 text-white-75">Quick Links</h6>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-1"><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
              <li className="mb-1"><a href="#how-it-works" className="text-white-50 text-decoration-none">How It Works</a></li>
              <li className="mb-1"><a href="#benefits" className="text-white-50 text-decoration-none">Benefits</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="fw-semibold mb-3 text-white-75">Contact Support</h6>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-1">
                <i className="bi bi-envelope-fill me-2"></i>support@hallmatrix.in
              </li>
              <li className="mb-1">
                <i className="bi bi-telephone-fill me-2"></i>+91 98765 43210
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <p className="text-center text-white-50 small mb-0">
          © {new Date().getFullYear()} Hall Matrix. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
