import { useState } from 'react'
import { Card, Table, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCollegeSettings } from '../../../../context/CollegeSettingsContext'

export default function Department() {
  const { loading, degrees, departments, addDepartment, updateDepartment, removeDepartment } = useCollegeSettings()

  const [selectedDegreeId, setSelectedDegreeId] = useState('')
  const [deptName, setDeptName] = useState('')
  const [adding, setAdding]     = useState(false)
  const [formError, setFormError] = useState('')

  const [editId, setEditId]           = useState(null)
  const [editDegreeId, setEditDegreeId] = useState('')
  const [editName, setEditName]       = useState('')
  const [editError, setEditError]     = useState('')
  const [saving, setSaving]           = useState(false)

  const [deletingId, setDeletingId]   = useState(null)

  async function handleAdd(e) {
    e.preventDefault()
    if (!selectedDegreeId || !deptName.trim()) return
    setAdding(true)
    setFormError('')
    try {
      await addDepartment(Number(selectedDegreeId), deptName)
      setDeptName('')
      setSelectedDegreeId('')
    } catch (err) {
      setFormError(err.response?.data?.errors?.name?.[0] || 'Failed to add department.')
    } finally {
      setAdding(false)
    }
  }

  function startEdit(dept) {
    setEditId(dept.id)
    setEditDegreeId(String(dept.degree_id))
    setEditName(dept.name)
    setEditError('')
  }

  function cancelEdit() {
    setEditId(null)
    setEditError('')
  }

  async function saveEdit(id) {
    if (!editDegreeId || !editName.trim()) return
    setSaving(true)
    setEditError('')
    try {
      await updateDepartment(id, Number(editDegreeId), editName)
      setEditId(null)
    } catch (err) {
      setEditError(err.response?.data?.errors?.name?.[0] || 'Failed to update department.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await removeDepartment(id)
    } catch {
      setFormError('Failed to delete department. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Student Mang &rsaquo; Settings &rsaquo; <span>Department</span></div>
        <h5>Department Management</h5>
      </div>

      <Row className="g-4">
        {/* ── Add form ── */}
        <Col md={4}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-diagram-2-fill text-success me-2"></i>Add Department
              </h6>

              {/* Warn if no degrees exist */}
              {degrees.length === 0 && !loading && (
                <Alert variant="warning" className="py-2 small mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  No degrees found.{' '}
                  <Link to="/college/student/settings/degree" className="alert-link">
                    Add a degree first
                  </Link>
                  .
                </Alert>
              )}

              {formError && (
                <Alert variant="danger" className="py-2 small mb-3">{formError}</Alert>
              )}

              <Form onSubmit={handleAdd}>
                {/* Degree dropdown */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">
                    Degree <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={selectedDegreeId}
                    onChange={e => setSelectedDegreeId(e.target.value)}
                    disabled={degrees.length === 0}
                    required
                  >
                    <option value="">-- Select Degree --</option>
                    {degrees.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Department name */}
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">
                    Department Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    placeholder="e.g. CSE, ECE, MECH"
                    value={deptName}
                    onChange={e => setDeptName(e.target.value)}
                    disabled={degrees.length === 0}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={degrees.length === 0 || adding}
                >
                  {adding ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-plus-lg me-1"></i>Add Department</>}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ── List ── */}
        <Col md={8}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-list-ul text-success me-2"></i>Department List
              </h6>
              <Table className="ca-table mb-0" hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Degree</th>
                    <th>Department Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-4"><Spinner animation="border" size="sm" /></td></tr>
                  ) : departments.length === 0
                    ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-4">
                          No departments added yet.
                        </td>
                      </tr>
                    )
                    : departments.map((d, i) => {
                        const isEditing = editId === d.id
                        return (
                          <tr key={d.id}>
                            <td>{i + 1}</td>
                            <td>
                              {isEditing ? (
                                <Form.Select
                                  size="sm"
                                  value={editDegreeId}
                                  onChange={e => setEditDegreeId(e.target.value)}
                                  disabled={saving}
                                >
                                  {degrees.map(deg => (
                                    <option key={deg.id} value={deg.id}>{deg.name}</option>
                                  ))}
                                </Form.Select>
                              ) : (
                                <span className="badge bg-success-subtle text-success fw-semibold px-2">
                                  {d.degreeName}
                                </span>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <>
                                  <Form.Control
                                    size="sm"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    autoFocus
                                    disabled={saving}
                                  />
                                  {editError && <div className="text-danger small mt-1">{editError}</div>}
                                </>
                              ) : (
                                d.name
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <div className="d-flex gap-2">
                                  <Button size="sm" variant="success" onClick={() => saveEdit(d.id)} disabled={saving}>
                                    {saving ? <Spinner animation="border" size="sm" /> : <i className="bi bi-check-lg"></i>}
                                  </Button>
                                  <Button size="sm" variant="outline-secondary" onClick={cancelEdit} disabled={saving}>
                                    <i className="bi bi-x-lg"></i>
                                  </Button>
                                </div>
                              ) : (
                                <div className="d-flex gap-2">
                                  <Button size="sm" variant="outline-primary" onClick={() => startEdit(d)}>
                                    <i className="bi bi-pencil me-1"></i>Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDelete(d.id)}
                                    disabled={deletingId === d.id}
                                  >
                                    {deletingId === d.id ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-trash me-1"></i>Delete</>}
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })
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
