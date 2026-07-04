import { Container, Row, Col } from 'react-bootstrap'

const steps = [
  {
    num: '1',
    icon: 'bi-building-add',
    title: 'Register Your College',
    desc: 'Sign up with your college details and get instant access to the dashboard.',
  },
  {
    num: '2',
    icon: 'bi-people-fill',
    title: 'Add Students & Halls',
    desc: 'Upload your student list and configure the examination halls with seat capacity.',
  },
  {
    num: '3',
    icon: 'bi-magic',
    title: 'Generate Allocation',
    desc: 'Click Generate — the system allocates every student to a specific seat automatically.',
  },
  {
    num: '4',
    icon: 'bi-printer-fill',
    title: 'Print & Publish',
    desc: 'Download hall-wise seating charts and distribute to students and invigilators.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-5" style={{ background: '#f0f4ff' }}>
      <Container fluid="xl" className="py-3">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 mb-2">How It Works</h2>
          <p className="text-muted fs-5" style={{ maxWidth: 480, margin: '0 auto' }}>
            Four simple steps to move from student list to printed seating chart.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {steps.map(({ num, icon, title, desc }, idx) => (
            <Col key={num} md={6} lg={3}>
              <div className="text-center position-relative">
                <div className="step-circle mb-3">{num}</div>
                <i className={`bi ${icon} fs-2 text-primary mb-3 d-block`}></i>
                <h5 className="fw-bold">{title}</h5>
                <p className="text-muted small">{desc}</p>
                {idx < steps.length - 1 && (
                  <div
                    className="d-none d-lg-block position-absolute top-0 end-0 text-muted"
                    style={{ marginTop: '22px', marginRight: '-22px', fontSize: '1.8rem' }}
                  >
                    <i className="bi bi-arrow-right"></i>
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
