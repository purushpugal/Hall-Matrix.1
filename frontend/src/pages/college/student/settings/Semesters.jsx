import { useState } from 'react'
import { Card, Table, Button, Form, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap'
import { useCollegeSettings } from '../../../../context/CollegeSettingsContext'

const SEM_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

export default function Semesters() {
  const {
    loading, degrees, departments, batches, subjects,
    semesters, addSemester, removeSemester,
  } = useCollegeSettings()

  const [degreeId, setDegreeId]         = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [batchId, setBatchId]           = useState('')
  const [semesterNumber, setSemesterNumber] = useState('1')
  const [subjectIds, setSubjectIds]     = useState([])

  const [adding, setAdding]       = useState(false)
  const [formError, setFormError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const availableDepartments = departments.filter(d => String(d.degree_id) === String(degreeId))

  function toggleSubject(id) {
    setSubjectIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  function resetForm() {
    setDegreeId('')
    setDepartmentId('')
    setBatchId('')
    setSemesterNumber('1')
    setSubjectIds([])
  }

  async function add(e) {
    e.preventDefault()
    setFormError('')
    if (!degreeId || !departmentId || !batchId) {
      setFormError('Select degree, department and batch.')
      return
    }
    if (subjectIds.length === 0) {
      setFormError('Select at least one subject.')
      return
    }
    setAdding(true)
    try {
      await addSemester(Number(degreeId), Number(departmentId), Number(batchId), Number(semesterNumber), subjectIds)
      resetForm()
    } catch (err) {
      setFormError(
        err.response?.data?.errors?.semester_number?.[0]
        || err.response?.data?.errors?.subject_ids?.[0]
        || 'Failed to add semester.'
      )
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await removeSemester(id)
    } catch {
      setFormError('Failed to delete semester. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Student Mang &rsaquo; Settings &rsaquo; <span>Semesters</span></div>
        <h5>Semester Management</h5>
      </div>
      <Row className="g-4">
        {/* ── Add form ── */}
        <Col md={5}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-layers-fill text-success me-2"></i>Add Semester</h6>
              {formError && <Alert variant="danger" className="py-2 small">{formError}</Alert>}
              <Form onSubmit={add}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Batch <span className="text-danger">*</span></Form.Label>
                  <Form.Select value={batchId} onChange={e => setBatchId(e.target.value)}>
                    <option value="">-- Select Batch --</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.from_year} - {b.to_year}</option>)}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Degree <span className="text-danger">*</span></Form.Label>
                  <Form.Select value={degreeId} onChange={e => { setDegreeId(e.target.value); setDepartmentId('') }}>
                    <option value="">-- Select Degree --</option>
                    {degrees.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Department <span className="text-danger">*</span></Form.Label>
                  <Form.Select value={departmentId} onChange={e => setDepartmentId(e.target.value)} disabled={!degreeId}>
                    <option value="">-- Select Department --</option>
                    {availableDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Semester <span className="text-danger">*</span></Form.Label>
                  <Form.Select value={semesterNumber} onChange={e => setSemesterNumber(e.target.value)}>
                    {SEM_LABELS.map((label, i) => <option key={label} value={i + 1}>Semester {label}</option>)}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">
                    Subjects <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="border rounded p-3" style={{ maxHeight: 220, overflowY: 'auto' }}>
                    {subjects.length === 0 ? (
                      <div className="text-muted small">No subjects set up yet.</div>
                    ) : (
                      subjects.map(s => (
                        <Form.Check
                          key={s.id}
                          type="checkbox"
                          id={`subject-${s.id}`}
                          className="mb-2"
                          checked={subjectIds.includes(s.id)}
                          onChange={() => toggleSubject(s.id)}
                          label={<span><span className="badge bg-primary-subtle text-primary me-2">{s.code}</span>{s.name}</span>}
                        />
                      ))
                    )}
                  </div>
                </Form.Group>

                <Button type="submit" variant="success" className="w-100" disabled={adding}>
                  {adding ? <Spinner animation="border" size="sm" /> : 'Add Semester'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ── List ── */}
        <Col md={7}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-list-ul text-success me-2"></i>Semester List</h6>
              <Table className="ca-table mb-0" hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Semester</th>
                    <th>Degree</th>
                    <th>Department</th>
                    <th>Batch</th>
                    <th>Subjects</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-4"><Spinner animation="border" size="sm" /></td></tr>
                  ) : semesters.length === 0
                    ? <tr><td colSpan={7} className="text-center text-muted py-4">No semesters added yet.</td></tr>
                    : semesters.map((s, i) => (
                        <tr key={s.id}>
                          <td>{i + 1}</td>
                          <td><span className="badge bg-info-subtle text-info fw-bold px-3">Sem {SEM_LABELS[s.semester_number - 1]}</span></td>
                          <td>{s.degree}</td>
                          <td>{s.department}</td>
                          <td>{s.batch}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {s.subjects.map(sub => (
                                <Badge key={sub.id} bg="secondary-subtle" text="secondary" className="fw-normal">{sub.code}</Badge>
                              ))}
                            </div>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(s.id)}
                              disabled={deletingId === s.id}
                            >
                              {deletingId === s.id ? <Spinner animation="border" size="sm" /> : 'Delete'}
                            </Button>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
