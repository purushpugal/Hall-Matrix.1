import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Row, Col, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap'
import api from '../../../api/axios'

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

export default function TutorStudentView() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get(`/students/${id}`)
      .then(res => setStudent(res.data.student))
      .catch(() => setError('Failed to load student details. Make sure this student is assigned to you.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (semId, subId, newStatus) => {
    try {
      await api.put(`/students/${id}/subject-status`, {
        semester_id: semId,
        subject_id: subId,
        status: newStatus
      })
      
      setStudent(prev => {
        const newStudent = { ...prev }
        newStudent.semesters = newStudent.semesters.map(sem => {
          if (sem.id === semId) {
            sem.subjects = sem.subjects.map(sub => {
              if (sub.id === subId) {
                return { ...sub, status: newStatus }
              }
              return sub
            })
          }
          return sem
        })
        return newStudent
      })
    } catch (err) {
      alert('Failed to update status. Please try again.')
    }
  }

  return (
    <>
      <div className="ca-page-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="ca-breadcrumb mb-1">
            Tutor Portal &rsaquo; <Link to="/tutor/dashboard">My Students</Link> &rsaquo; <span>View</span>
          </div>
          <h5 className="mb-0">Student Details</h5>
        </div>
        <Link to="/tutor/dashboard" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to List
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : student && (
        <Row className="g-4">
          <Col lg={4}>
            <Card className="ca-card text-center">
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
                <Card className="ca-card h-100">
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
                <Card className="ca-card h-100">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-mortarboard-fill text-success me-2"></i>College Info
                    </h6>
                    <Field icon="bi-hash" label="Register No" value={student.register_no} />
                    <Field icon="bi-mortarboard-fill" label="Degree" value={student.degree} />
                    <Field icon="bi-diagram-2-fill" label="Department" value={student.department} />
                    <Field icon="bi-calendar-range-fill" label="Batch" value={student.batch} />
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12}>
                <Card className="ca-card">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-layers-fill text-success me-2"></i>Semesters &amp; Subjects
                    </h6>
                    {student.semesters.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>
                        No semesters set up yet for {student.degree} &rsaquo; {student.department} &rsaquo; {student.batch}.
                      </div>
                    ) : (
                      student.semesters.map(sem => (
                        <div key={sem.id} className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                          <Badge bg="info-subtle" text="info" className="fw-bold px-3 py-2 flex-shrink-0">
                            Sem {SEM_LABELS[sem.semester_number - 1]}
                          </Badge>
                          <div className="d-flex flex-wrap gap-2">
                            {sem.subjects.length === 0 ? (
                              <span className="text-muted small">No subjects assigned.</span>
                            ) : (
                              sem.subjects.map(sub => (
                                <div key={sub.id} className="d-flex align-items-center gap-2 bg-light border rounded px-2 py-1">
                                  <span className="text-primary small fw-semibold">
                                    {sub.code} — {sub.name}
                                  </span>
                                  <Form.Select
                                    size="sm"
                                    value={sub.status || 'pending'}
                                    onChange={(e) => handleStatusChange(sem.id, sub.id, e.target.value)}
                                    className={`py-0 ps-2 pe-4 small border-0 fw-semibold ${
                                      sub.status === 'pass' ? 'text-success bg-success-subtle' : 
                                      sub.status === 'fail' ? 'text-danger bg-danger-subtle' : 
                                      'text-muted bg-secondary-subtle'
                                    }`}
                                    style={{ width: 'auto', minWidth: '95px' }}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="pass">Pass</option>
                                    <option value="fail">Fail</option>
                                  </Form.Select>
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

              <Col xs={12}>
                <Card className="ca-card">
                  <Card.Body className="p-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="text-muted small">
                      <i className="bi bi-clock-history me-1"></i>
                      Registered on {new Date(student.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </div>
                    <Button as={Link} to="/tutor/dashboard" variant="outline-secondary" size="sm">
                      <i className="bi bi-arrow-left me-1"></i>Back to List
                    </Button>
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
