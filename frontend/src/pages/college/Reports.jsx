import { Card, Row, Col, Button } from 'react-bootstrap'

const REPORT_TYPES = [
  { icon: 'bi-diagram-3-fill',      label: 'Seating Chart',      desc: 'Hall-wise seat allocation chart for printing.',    color: 'primary' },
  { icon: 'bi-person-lines-fill',   label: 'Student Roll List',  desc: 'Full list of students with seat numbers.',         color: 'success' },
  { icon: 'bi-person-badge-fill',   label: 'Invigilator Duty',   desc: 'Hall-wise invigilator assignment report.',         color: 'warning' },
  { icon: 'bi-grid-3x3-gap-fill',   label: 'Hall Utilisation',   desc: 'Capacity vs occupied seats per exam hall.',        color: 'info'    },
  { icon: 'bi-journal-text',        label: 'Exam Schedule',      desc: 'Complete schedule of all exams with venues.',      color: 'danger'  },
]

export default function Reports() {
  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1"><span>Reports</span></div>
        <h5>Reports &amp; Exports</h5>
      </div>
      <Row className="g-4">
        {REPORT_TYPES.map(({ icon, label, desc, color }) => (
          <Col key={label} md={6} lg={4}>
            <Card className="ca-card h-100">
              <Card.Body className="p-4 d-flex flex-column">
                <div className={`ca-stat-icon bg-${color} bg-opacity-10 text-${color} mb-3`}>
                  <i className={`bi ${icon}`}></i>
                </div>
                <h6 className="fw-bold mb-1">{label}</h6>
                <p className="text-muted small flex-grow-1">{desc}</p>
                <Button variant={`outline-${color}`} size="sm" className="mt-2 align-self-start">
                  <i className="bi bi-download me-1"></i>Download PDF
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
