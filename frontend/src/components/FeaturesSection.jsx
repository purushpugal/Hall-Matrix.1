import { Container, Row, Col, Card } from 'react-bootstrap'

const features = [
  {
    icon: 'bi-cpu-fill',
    color: 'primary',
    title: 'Automated Allocation',
    desc: 'Intelligent algorithms assign seats instantly based on student count, hall capacity, and exam rules — no manual intervention needed.',
  },
  {
    icon: 'bi-building-fill',
    color: 'success',
    title: 'Multi-Hall Support',
    desc: 'Manage multiple examination halls across your college premises from a single dashboard with real-time capacity tracking.',
  },
  {
    icon: 'bi-file-earmark-spreadsheet-fill',
    color: 'warning',
    title: 'Bulk Student Import',
    desc: 'Upload student data via Excel or CSV files. The system processes thousands of records in seconds.',
  },
  {
    icon: 'bi-printer-fill',
    color: 'danger',
    title: 'Printable Reports',
    desc: 'Generate hall-wise seating charts, student roll-number lists, and invigilator duty sheets ready for printing.',
  },
  {
    icon: 'bi-shield-check-fill',
    color: 'info',
    title: 'Anti-Malpractice Rules',
    desc: 'Automatically separates students from the same department or section to minimise copying during exams.',
  },
  {
    icon: 'bi-phone-fill',
    color: 'secondary',
    title: 'Mobile Friendly',
    desc: 'Access seating plans and hall details from any device — desktop, tablet, or smartphone.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-5 bg-white">
      <Container fluid="xl" className="py-3">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 mb-2">
            Everything Your College Needs
          </h2>
          <p className="text-muted fs-5" style={{ maxWidth: 520, margin: '0 auto' }}>
            Purpose-built tools that replace spreadsheets, paper lists, and last-minute chaos.
          </p>
        </div>

        <Row className="g-4">
          {features.map(({ icon, color, title, desc }) => (
            <Col key={title} md={6} lg={4}>
              <Card className="h-100 shadow-sm feature-card p-1">
                <Card.Body className="p-4">
                  <div className={`text-${color} mb-3`}>
                    <i className={`bi ${icon}`} style={{ fontSize: '2rem' }}></i>
                  </div>
                  <Card.Title className="fw-bold">{title}</Card.Title>
                  <Card.Text className="text-muted">{desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
