import { Container, Row, Col } from 'react-bootstrap'

const benefits = [
  {
    icon: 'bi-clock-history',
    bg: 'bg-primary bg-opacity-10 text-primary',
    title: 'Save 90% Admin Time',
    desc: 'What used to take 2–3 days of manual seat planning now completes in minutes.',
  },
  {
    icon: 'bi-exclamation-triangle-fill',
    bg: 'bg-danger bg-opacity-10 text-danger',
    title: 'Zero Human Errors',
    desc: 'No duplicate seat numbers, no missed students, no last-minute reprints due to typos.',
  },
  {
    icon: 'bi-bar-chart-fill',
    bg: 'bg-success bg-opacity-10 text-success',
    title: 'Optimised Hall Utilisation',
    desc: 'The system fills halls to capacity efficiently, preventing half-empty rooms.',
  },
  {
    icon: 'bi-archive-fill',
    bg: 'bg-warning bg-opacity-10 text-warning',
    title: 'Permanent Records',
    desc: "Every exam's seating arrangement is stored digitally — accessible anytime for audits.",
  },
  {
    icon: 'bi-shield-lock-fill',
    bg: 'bg-info bg-opacity-10 text-info',
    title: 'Exam Integrity',
    desc: 'Smart separation rules prevent students from the same class sitting together.',
  },
  {
    icon: 'bi-headset',
    bg: 'bg-secondary bg-opacity-10 text-secondary',
    title: 'Dedicated Support',
    desc: 'Our team is available to help you set up and run your first exam allocation smoothly.',
  },
]

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-5 bg-white">
      <Container fluid="xl" className="py-3">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 mb-2">Why Colleges Choose Hall Matrix</h2>
          <p className="text-muted fs-5" style={{ maxWidth: 520, margin: '0 auto' }}>
            Trusted by examination controllers across universities for reliable, fast,
            and transparent seat allocation.
          </p>
        </div>

        <Row className="g-4">
          {benefits.map(({ icon, bg, title, desc }) => (
            <Col key={title} md={6} lg={4}>
              <div className="d-flex gap-3 align-items-start">
                <div className={`benefit-icon ${bg}`}>
                  <i className={`bi ${icon}`}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{title}</h6>
                  <p className="text-muted small mb-0">{desc}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* CTA Banner */}
        <div
          className="mt-5 rounded-4 text-white text-center py-5 px-4"
          style={{ background: 'linear-gradient(135deg, #1a3a6e 0%, #2d6bcf 100%)' }}
        >
          <h3 className="fw-bold mb-2">Ready to modernise your exam management?</h3>
          <p className="opacity-75 mb-4">
            Join hundreds of colleges already using Hall Matrix to run stress-free examinations.
          </p>
          <a
            href="#"
            className="btn btn-warning btn-lg fw-bold px-5"
            onClick={e => {
              e.preventDefault()
              document.querySelector('.btn-register-college')?.click()
            }}
          >
            <i className="bi bi-building-add me-2"></i>Register Your College — It's Free
          </a>
        </div>
      </Container>
    </section>
  )
}
