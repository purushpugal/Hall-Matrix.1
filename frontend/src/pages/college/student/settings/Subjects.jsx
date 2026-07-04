import { Card, Table, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import { useCollegeSettings } from '../../../../context/CollegeSettingsContext'

export default function Subjects() {
  const { loading, subjects, addSubject, updateSubject, removeSubject } = useCollegeSettings()

  const [form, setForm]           = useState({ code: '', name: '' })
  const [adding, setAdding]       = useState(false)
  const [formError, setFormError] = useState('')

  const [editId, setEditId]       = useState(null)
  const [editCode, setEditCode]   = useState('')
  const [editName, setEditName]   = useState('')
  const [editError, setEditError] = useState('')
  const [saving, setSaving]       = useState(false)

  const [deletingId, setDeletingId] = useState(null)

  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })) }

  async function add(e) {
    e.preventDefault()
    if (!form.code.trim() || !form.name.trim()) return
    setAdding(true)
    setFormError('')
    try {
      await addSubject(form.code, form.name)
      setForm({ code: '', name: '' })
    } catch (err) {
      setFormError(err.response?.data?.errors?.code?.[0] || err.response?.data?.errors?.name?.[0] || 'Failed to add subject.')
    } finally {
      setAdding(false)
    }
  }

  function startEdit(subject) {
    setEditId(subject.id)
    setEditCode(subject.code)
    setEditName(subject.name)
    setEditError('')
  }

  function cancelEdit() {
    setEditId(null)
    setEditError('')
  }

  async function saveEdit(id) {
    if (!editCode.trim() || !editName.trim()) return
    setSaving(true)
    setEditError('')
    try {
      await updateSubject(id, editCode, editName)
      setEditId(null)
    } catch (err) {
      setEditError(err.response?.data?.errors?.code?.[0] || err.response?.data?.errors?.name?.[0] || 'Failed to update subject.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await removeSubject(id)
    } catch {
      setFormError('Failed to delete subject. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Student Mang &rsaquo; Settings &rsaquo; <span>Subjects</span></div>
        <h5>Subject Management</h5>
      </div>
      <Row className="g-4">
        <Col md={4}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-book-fill text-success me-2"></i>Add Subject</h6>
              {formError && <Alert variant="danger" className="py-2 small">{formError}</Alert>}
              <Form onSubmit={add}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Subject Code</Form.Label>
                  <Form.Control name="code" placeholder="e.g. CS101" value={form.code} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Subject Name</Form.Label>
                  <Form.Control name="name" placeholder="e.g. Data Structures" value={form.name} onChange={onChange} />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100" disabled={adding}>
                  {adding ? <Spinner animation="border" size="sm" /> : 'Add Subject'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-list-ul text-success me-2"></i>Subject List</h6>
              <Table className="ca-table mb-0" hover>
                <thead><tr><th>#</th><th>Code</th><th>Subject Name</th><th>Action</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-4"><Spinner animation="border" size="sm" /></td></tr>
                  ) : subjects.length === 0
                    ? <tr><td colSpan={4} className="text-center text-muted py-4">No subjects added yet.</td></tr>
                    : subjects.map((s, i) => {
                        const isEditing = editId === s.id
                        return (
                          <tr key={s.id}>
                            <td>{i + 1}</td>
                            <td>
                              {isEditing ? (
                                <Form.Control
                                  size="sm"
                                  value={editCode}
                                  onChange={e => setEditCode(e.target.value)}
                                  autoFocus
                                  disabled={saving}
                                />
                              ) : (
                                <span className="badge bg-primary-subtle text-primary">{s.code}</span>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <>
                                  <Form.Control
                                    size="sm"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    disabled={saving}
                                  />
                                  {editError && <div className="text-danger small mt-1">{editError}</div>}
                                </>
                              ) : (
                                s.name
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <div className="d-flex gap-2">
                                  <Button size="sm" variant="success" onClick={() => saveEdit(s.id)} disabled={saving}>
                                    {saving ? <Spinner animation="border" size="sm" /> : <i className="bi bi-check-lg"></i>}
                                  </Button>
                                  <Button size="sm" variant="outline-secondary" onClick={cancelEdit} disabled={saving}>
                                    <i className="bi bi-x-lg"></i>
                                  </Button>
                                </div>
                              ) : (
                                <div className="d-flex gap-2">
                                  <Button size="sm" variant="outline-primary" onClick={() => startEdit(s)}>
                                    <i className="bi bi-pencil me-1"></i>Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDelete(s.id)}
                                    disabled={deletingId === s.id}
                                  >
                                    {deletingId === s.id ? <Spinner animation="border" size="sm" /> : 'Delete'}
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
