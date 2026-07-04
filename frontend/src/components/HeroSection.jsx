import { Container, Row, Col, Button, Badge } from 'react-bootstrap'

export default function HeroSection({ onLoginClick }) {
  return (
    <section className="hero-section text-white" id="hero">
      <Container fluid="xl" className="py-5">
        <Row className="align-items-center g-5">
          <Col lg={7}>
            <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 rounded-pill fs-6">
              <i className="bi bi-lightning-charge-fill me-1"></i> Smart Exam Management
            </Badge>

            <h1 className="display-4 fw-bold lh-sm mb-4">
              Automate Your Exam<br />
              <span className="text-warning">Hall Seat Allocation</span>
            </h1>

            <p className="lead text-white-75 mb-4" style={{ maxWidth: '560px', opacity: 0.85 }}>
              Hall Matrix eliminates manual seat planning. Colleges can register, upload
              student data, and generate optimised hall seating arrangements instantly —
              saving hours of administrative effort before every exam.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              <Button
                variant="warning"
                size="lg"
                className="fw-bold px-4"
                onClick={onLoginClick}
              >
                <i className="bi bi-person-check-fill me-2"></i>College Login
              </Button>
              <Button variant="outline-light" size="lg" className="px-4" href="#how-it-works">
                <i className="bi bi-play-circle me-2"></i>How It Works
              </Button>
            </div>

            <div className="d-flex flex-wrap gap-4">
              {[
                { icon: 'bi-building', label: '500+', sub: 'Colleges' },
                { icon: 'bi-person-fill', label: '1.2L+', sub: 'Students Managed' },
                { icon: 'bi-clock-fill', label: '95%', sub: 'Time Saved' },
              ].map(({ icon, label, sub }) => (
                <div key={sub} className="text-center">
                  <i className={`bi ${icon} fs-4 text-warning`}></i>
                  <div className="fw-bold fs-5">{label}</div>
                  <div className="small opacity-75">{sub}</div>
                </div>
              ))}
            </div>
          </Col>

          <Col lg={5} className="d-none d-lg-flex justify-content-center">
            <div
              className="bg-white bg-opacity-10 rounded-4 p-4 text-center shadow-lg"
              style={{ width: '100%', maxWidth: '380px' }}
            >
              <div className="mb-3">
                <i className="bi bi-grid-3x3-gap-fill text-warning" style={{ fontSize: '4rem' }}></i>
              </div>
              <h5 className="fw-bold mb-1">Exam Hall Layout</h5>
              <p className="small opacity-75 mb-4">Auto-generated seating plan</p>

              {/* Mini seat grid preview */}
              <div className="d-flex flex-column gap-1 mb-3">
                {['A','B','C','D'].map(row => (
                  <div key={row} className="d-flex justify-content-center gap-1">
                    {[1,2,3,4,5,6].map(col => (
                      <div
                        key={col}
                        className="rounded"
                        style={{
                          width: 36,
                          height: 28,
                          background: row === 'B' && col === 3 ? '#ffc107' : 'rgba(255,255,255,0.15)',
                          fontSize: '9px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        {row}{col}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="small opacity-75">
                <i className="bi bi-check-circle-fill text-success me-1"></i>
                Generated in seconds
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
