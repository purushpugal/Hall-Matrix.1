import { Fragment, useState } from 'react'
import { Card, Table, Button, Form, Row, Col, Alert, Modal, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCollegeSettings } from '../../../../context/CollegeSettingsContext'

export default function Degree() {
  const { loading, degrees, addDegree, updateDegree, removeDegree, departments } = useCollegeSettings()
  const [name, setName]           = useState('')
  const [adding, setAdding]       = useState(false)
  const [formError, setFormError] = useState('')

  const [errorId, setErrorId]     = useState(null)   // degree blocked from deletion
  const [confirmDegree, setConfirmDegree] = useState(null) // degree pending confirmation
  const [deleting, setDeleting]   = useState(false)

  const [editId, setEditId]       = useState(null)
  const [editName, setEditName]   = useState('')
  const [editError, setEditError] = useState('')
  const [saving, setSaving]       = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    setFormError('')
    try {
      await addDegree(name)
      setName('')
    } catch (err) {
      setFormError(err.response?.data?.errors?.name?.[0] || 'Failed to add degree.')
    } finally {
      setAdding(false)
    }
  }

  function handleDeleteClick(degree) {
    const count = departments.filter(dep => dep.degree_id === degree.id).length
    if (count > 0) {
      setErrorId(degree.id)
      setConfirmDegree(null)
      return
    }
    setErrorId(null)
    setConfirmDegree(degree)
  }

  async function confirmDelete() {
    if (!confirmDegree) return
    setDeleting(true)
    try {
      await removeDegree(confirmDegree.id)
      setConfirmDegree(null)
    } catch {
      setFormError('Failed to delete degree. Please try again.')
      setConfirmDegree(null)
    } finally {
      setDeleting(false)
    }
  }

  function startEdit(degree) {
    setEditId(degree.id)
    setEditName(degree.name)
    setEditError('')
  }

  function cancelEdit() {
    setEditId(null)
    setEditName('')
    setEditError('')
  }

  async function saveEdit(id) {
    if (!editName.trim()) return
    setSaving(true)
    setEditError('')
    try {
      await updateDegree(id, editName)
      setEditId(null)
    } catch (err) {
      setEditError(err.response?.data?.errors?.name?.[0] || 'Failed to update degree.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Student Mang &rsaquo; Settings &rsaquo; <span>Degree</span></div>
        <h5>Degree Management</h5>
      </div>

      <Row className="g-4">
        {/* ── Add form ── */}
        <Col md={4}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-mortarboard-fill text-success me-2"></i>Add Degree
              </h6>
              {formError && (
                <Alert variant="danger" className="py-2 small">{formError}</Alert>
              )}
              <Form onSubmit={handleAdd}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Degree Name</Form.Label>
                  <Form.Control
                    placeholder="e.g. B.E, B.Tech, M.E"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100" disabled={adding}>
                  {adding ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-plus-lg me-1"></i>Add Degree</>}
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
                <i className="bi bi-list-ul text-success me-2"></i>Degree List
              </h6>

              <Table className="ca-table mb-0" hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Degree Name</th>
                    <th>Total Departments</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-4"><Spinner animation="border" size="sm" /></td></tr>
                  ) : degrees.length === 0
                    ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-4">
                          No degrees added yet.
                        </td>
                      </tr>
                    )
                    : degrees.map((d, i) => {
                        const count   = departments.filter(dep => dep.degree_id === d.id).length
                        const blocked = errorId === d.id
                        const isEditing = editId === d.id

                        return (
                          <Fragment key={d.id}>
                            <tr className={blocked ? 'table-danger' : ''}>
                              <td>{i + 1}</td>
                              <td className="fw-semibold">
                                {isEditing ? (
                                  <Form.Control
                                    size="sm"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    autoFocus
                                    disabled={saving}
                                  />
                                ) : (
                                  d.name
                                )}
                                {isEditing && editError && (
                                  <div className="text-danger small mt-1">{editError}</div>
                                )}
                              </td>
                              <td>
                                <span className={`badge fw-semibold px-2 ${count > 0 ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                  {count}
                                </span>
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
                                      variant={count > 0 ? 'danger' : 'outline-danger'}
                                      onClick={() => handleDeleteClick(d)}
                                      title={count > 0 ? 'Cannot delete — has departments' : 'Delete degree'}
                                    >
                                      <i className="bi bi-trash me-1"></i>Delete
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>

                            {/* Inline error row for blocked degrees */}
                            {blocked && (
                              <tr className="table-danger border-0">
                                <td colSpan={4} className="pt-0 pb-2 px-3 border-0">
                                  <Alert variant="danger" className="mb-0 py-2 px-3 small d-flex align-items-start gap-2">
                                    <i className="bi bi-exclamation-circle-fill mt-1 flex-shrink-0"></i>
                                    <span>
                                      <strong>{d.name}</strong> cannot be deleted because it has{' '}
                                      <strong>{count} department{count > 1 ? 's' : ''}</strong> linked to it.
                                      Please{' '}
                                      <Link
                                        to="/college/student/settings/department"
                                        className="alert-link"
                                        onClick={() => setErrorId(null)}
                                      >
                                        delete all departments
                                      </Link>
                                      {' '}under this degree first.
                                    </span>
                                    <button
                                      className="btn-close ms-auto flex-shrink-0"
                                      style={{ fontSize: '0.7rem' }}
                                      onClick={() => setErrorId(null)}
                                    />
                                  </Alert>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        )
                      })
                  }
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── Confirmation Modal ── */}
      <Modal
        show={!!confirmDegree}
        onHide={() => setConfirmDegree(null)}
        centered
        size="sm"
      >
        <Modal.Body className="p-4 text-center">
          <div
            className="rounded-circle bg-danger bg-opacity-10 text-danger mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: 60, height: 60, fontSize: '1.6rem' }}
          >
            <i className="bi bi-trash3-fill"></i>
          </div>
          <h6 className="fw-bold mb-1">Delete Degree?</h6>
          <p className="text-muted small mb-4">
            Are you sure you want to delete{' '}
            <strong className="text-dark">{confirmDegree?.name}</strong>?
            <br />This action cannot be undone.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-secondary"
              size="sm"
              className="px-4"
              onClick={() => setConfirmDegree(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="px-4"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-trash me-1"></i>Yes, Delete</>}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
