import { useEffect, useState } from 'react'
import { Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap'
import api from '../../api/axios'

const SEM_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

function Field({ icon, label, value }) {
  return (
    <div className="d-flex align-items-start gap-3 mb-3">
      <div
        className="rounded-circle bg-light border d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 36, height: 36 }}
      >
        <i className={`bi ${icon} text-muted`}></i>
      </div>
      <div>
        <div className="text-muted small">{label}</div>
        <div className="fw-semibold">{value || '—'}</div>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get('/student-profile')
      .then(res => setStudent(res.data.student))
      .catch(() => setError('Failed to load your profile details.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="ca-page-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="ca-breadcrumb mb-1">
            Student Portal &rsaquo; <span>My Profile</span>
          </div>
          <h5 className="mb-0">My Details</h5>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
      ) : student && (
        <Row className="g-4">
          <Col lg={4}>
            <Card className="ca-card text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                {student.photo_url ? (
                  <img
                    src={student.photo_url}
                    alt={student.name}
                    className="rounded-circle border mb-3"
                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light border d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: 120, height: 120 }}
                  >
                    <i className="bi bi-person-fill text-muted" style={{ fontSize: '3rem' }}></i>
                  </div>
                )}
                <h5 className="fw-bold mb-1">{student.name}</h5>
                <div className="text-muted small mb-2">{student.register_no}</div>
                <Badge bg={student.is_active ? 'success' : 'danger'} className="text-uppercase">
                  {student.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Row className="g-4">
              <Col md={6}>
                <Card className="ca-card h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-person-vcard-fill text-primary me-2"></i>Personal Info
                    </h6>
                    <Field icon="bi-person-fill" label="Name" value={student.name} />
                    <Field icon="bi-envelope-fill" label="Email" value={student.email} />
                    <Field icon="bi-telephone-fill" label="Phone" value={student.phone} />
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="ca-card h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-mortarboard-fill text-success me-2"></i>College Info
                    </h6>
                    <Field icon="bi-hash" label="Register No" value={student.register_no} />
                    <Field icon="bi-mortarboard-fill" label="Degree" value={student.degree} />
                    <Field icon="bi-diagram-2-fill" label="Department" value={student.department} />
                    <Field icon="bi-calendar-range-fill" label="Batch" value={student.batch} />
                    {student.tutor && <Field icon="bi-person-badge" label="Assigned Tutor" value={student.tutor} />}
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12}>
                <Card className="ca-card border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-layers-fill text-success me-2"></i>Semesters &amp; Subjects Status
                    </h6>
                    {student.semesters.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>
                        No semesters available for your batch yet.
                      </div>
                    ) : (
                      student.semesters.map(sem => (
                        <div key={sem.id} className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                          <Badge bg="success-subtle" text="success" className="fw-bold px-3 py-2 flex-shrink-0">
                            Sem {SEM_LABELS[sem.semester_number - 1]}
                          </Badge>
                          <div className="d-flex flex-wrap gap-2">
                            {sem.subjects.length === 0 ? (
                              <span className="text-muted small">No subjects assigned.</span>
                            ) : (
                              sem.subjects.map(sub => (
                                <div key={sub.id} className="d-flex align-items-center gap-2 bg-light border rounded px-2 py-1">
                                  <span className="text-dark small fw-semibold">
                                    {sub.code} — {sub.name}
                                  </span>
                                  <Badge 
                                    bg={sub.status === 'pass' ? 'success' : sub.status === 'fail' ? 'danger' : 'secondary'}
                                    className="text-uppercase ms-2"
                                  >
                                    {sub.status || 'pending'}
                                  </Badge>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  )
}
