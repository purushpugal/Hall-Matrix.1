import { useEffect, useState } from 'react'
import { Card, Table, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap'
import api from '../../api/axios'

export default function Colleges() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchColleges()
  }, [])

  async function fetchColleges() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/colleges')
      setColleges(res.data.colleges)
    } catch {
      setError('Failed to load colleges. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleStatus(college) {
    setUpdatingId(college.id)
    try {
      const res = await api.patch(`/colleges/${college.id}/status`, { is_active: !college.is_active })
      setColleges(prev => prev.map(c => (c.id === college.id ? res.data.college : c)))
    } catch {
      setError('Failed to update college status. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/colleges/${deleteTarget.id}`)
      setColleges(prev => prev.filter(c => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      setError('Failed to delete college. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-0">Colleges</h4>
          <p className="text-muted small mb-0">Colleges that have registered on Hall Matrix.</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={fetchColleges} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Card className="stat-card">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table className="sa-table mb-0" responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>College</th>
                  <th>Code</th>
                  <th>Contact Person</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Registered On</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {colleges.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>
                      No colleges registered yet
                    </td>
                  </tr>
                ) : (
                  colleges.map((college, idx) => (
                    <tr key={college.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="fw-semibold text-dark">{college.college_name}</td>
                      <td><span className="text-muted">{college.college_code}</span></td>
                      <td>{college.contact_person}</td>
                      <td>{college.contact_number}</td>
                      <td className="text-muted">{college.email}</td>
                      <td>
                        <Badge bg={college.is_active ? 'success' : 'danger'} className="text-uppercase">
                          {college.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="text-muted">
                        {new Date(college.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            size="sm"
                            variant={college.is_active ? 'outline-danger' : 'outline-success'}
                            disabled={updatingId === college.id}
                            onClick={() => toggleStatus(college)}
                          >
                            {updatingId === college.id ? (
                              <Spinner animation="border" size="sm" />
                            ) : college.is_active ? (
                              'Deactivate'
                            ) : (
                              'Activate'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            title="Delete college"
                            onClick={() => setDeleteTarget(college)}
                          >
                            <i className="bi bi-trash3"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
          <h6 className="fw-bold mb-2">Delete this college?</h6>
          <p className="text-muted small mb-4">
            This will permanently remove <strong>{deleteTarget?.college_name}</strong> and its admin account. This action cannot be undone.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="light" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : 'Delete'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
