import { Card, Table, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import { useCollegeSettings } from '../../../../context/CollegeSettingsContext'

const THIS_YEAR = new Date().getFullYear()

function isValidYear(value) {
  return /^\d{4}$/.test(String(value).trim())
}

export default function Batch() {
  const { loading, batches, addBatch, updateBatch, removeBatch } = useCollegeSettings()

  const [from, setFrom] = useState(String(THIS_YEAR))
  const [to,   setTo]   = useState(String(THIS_YEAR + 4))
  const [adding, setAdding]       = useState(false)
  const [formError, setFormError] = useState('')

  const [editId, setEditId]       = useState(null)
  const [editFrom, setEditFrom]   = useState('')
  const [editTo, setEditTo]       = useState('')
  const [editError, setEditError] = useState('')
  const [saving, setSaving]       = useState(false)

  const [deletingId, setDeletingId] = useState(null)

  async function add(e) {
    e.preventDefault()
    setFormError('')
    if (!isValidYear(from) || !isValidYear(to)) {
      setFormError('Enter valid 4-digit years.')
      return
    }
    if (Number(from) >= Number(to)) {
      setFormError('To Year must be greater than From Year.')
      return
    }
    setAdding(true)
    try {
      await addBatch(Number(from), Number(to))
    } catch (err) {
      setFormError(err.response?.data?.errors?.to_year?.[0] || 'Failed to add batch.')
    } finally {
      setAdding(false)
    }
  }

  function startEdit(batch) {
    setEditId(batch.id)
    setEditFrom(String(batch.from_year))
    setEditTo(String(batch.to_year))
    setEditError('')
  }

  function cancelEdit() {
    setEditId(null)
    setEditError('')
  }

  async function saveEdit(id) {
    if (!isValidYear(editFrom) || !isValidYear(editTo)) {
      setEditError('Enter valid 4-digit years.')
      return
    }
    if (Number(editFrom) >= Number(editTo)) {
      setEditError('To Year must be greater than From Year.')
      return
    }
    setSaving(true)
    setEditError('')
    try {
      await updateBatch(id, Number(editFrom), Number(editTo))
      setEditId(null)
    } catch (err) {
      setEditError(err.response?.data?.errors?.to_year?.[0] || 'Failed to update batch.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await removeBatch(id)
    } catch {
      setFormError('Failed to delete batch. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Student Mang &rsaquo; Settings &rsaquo; <span>Batch</span></div>
        <h5>Batch Management</h5>
      </div>
      <Row className="g-4">
        <Col md={4}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-calendar-range-fill text-success me-2"></i>Add Batch</h6>
              {formError && <Alert variant="danger" className="py-2 small">{formError}</Alert>}
              <Form onSubmit={add}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">From Year</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="e.g. 2024"
                    value={from}
                    onChange={e => setFrom(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">To Year</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="e.g. 2028"
                    value={to}
                    onChange={e => setTo(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100" disabled={adding}>
                  {adding ? <Spinner animation="border" size="sm" /> : 'Add Batch'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-list-ul text-success me-2"></i>Batch List</h6>
              <Table className="ca-table mb-0" hover>
                <thead><tr><th>#</th><th>From Year</th><th>To Year</th><th>Label</th><th>Action</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-4"><Spinner animation="border" size="sm" /></td></tr>
                  ) : batches.length === 0
                    ? <tr><td colSpan={5} className="text-center text-muted py-4">No batches added yet.</td></tr>
                    : batches.map((b, i) => {
                        const isEditing = editId === b.id
                        return (
                          <tr key={b.id}>
                            <td>{i + 1}</td>
                            <td>
                              {isEditing ? (
                                <Form.Control
                                  size="sm"
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={4}
                                  value={editFrom}
                                  onChange={e => setEditFrom(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  disabled={saving}
                                />
                              ) : b.from_year}
                            </td>
                            <td>
                              {isEditing ? (
                                <>
                                  <Form.Control
                                    size="sm"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={editTo}
                                    onChange={e => setEditTo(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    disabled={saving}
                                  />
                                  {editError && <div className="text-danger small mt-1">{editError}</div>}
                                </>
                              ) : b.to_year}
                            </td>
                            <td><span className="badge bg-success-subtle text-success fw-semibold">{b.from_year} – {b.to_year}</span></td>
                            <td>
                              {isEditing ? (
                                <div className="d-flex gap-2">
                                  <Button size="sm" variant="success" onClick={() => saveEdit(b.id)} disabled={saving}>
                                    {saving ? <Spinner animation="border" size="sm" /> : <i className="bi bi-check-lg"></i>}
                                  </Button>
                                  <Button size="sm" variant="outline-secondary" onClick={cancelEdit} disabled={saving}>
                                    <i className="bi bi-x-lg"></i>
                                  </Button>
                                </div>
                              ) : (
                                <div className="d-flex gap-2">
                                  <Button size="sm" variant="outline-primary" onClick={() => startEdit(b)}>
                                    <i className="bi bi-pencil me-1"></i>Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDelete(b.id)}
                                    disabled={deletingId === b.id}
                                  >
                                    {deletingId === b.id ? <Spinner animation="border" size="sm" /> : 'Delete'}
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
