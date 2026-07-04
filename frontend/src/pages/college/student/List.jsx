import { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Modal, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../../../api/axios'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/students')
      setStudents(res.data.students)
    } catch {
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/students/${deleteTarget.id}`)
      setStudents(prev => prev.filter(s => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      setError('Failed to delete student. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="ca-page-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="ca-breadcrumb mb-1">Student Management &rsaquo; <span>List</span></div>
          <h5 className="mb-0">Student List</h5>
        </div>
        <Link to="/college/student/add" className="btn btn-success btn-sm">
          <i className="bi bi-person-plus-fill me-1"></i>Add Student
        </Link>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Card className="ca-card">
        <Card.Body className="p-4">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" size="sm" /></div>
          ) : (
            <Table className="ca-table mb-0" responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Register No</th>
                  <th>Degree</th>
                  <th>Department</th>
                  <th>Batch</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>No students added yet.
                    </td>
                  </tr>
                ) : (
                  students.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>
                        {s.photo_url ? (
                          <Image src={s.photo_url} roundedCircle width={36} height={36} style={{ objectFit: 'cover' }} />
                        ) : (
                          <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                            <i className="bi bi-person-fill text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{s.name}</td>
                      <td><span className="badge bg-primary-subtle text-primary">{s.register_no}</span></td>
                      <td>{s.degree}</td>
                      <td>{s.department}</td>
                      <td>{s.batch}</td>
                      <td className="text-muted">{s.email}</td>
                      <td>{s.phone}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button as={Link} to={`/college/student/view/${s.id}`} size="sm" variant="outline-primary">
                            <i className="bi bi-eye me-1"></i>View
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => setDeleteTarget(s)}>
                            <i className="bi bi-trash me-1"></i>Delete
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
        <Modal.Body className="p-4 text-center">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3 d-block"></i>
          <h6 className="fw-bold mb-1">Delete this student?</h6>
          <p className="text-muted small mb-4">
            This will permanently remove <strong className="text-dark">{deleteTarget?.name}</strong> and their login access. This action cannot be undone.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-secondary" size="sm" className="px-4" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" className="px-4" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-trash me-1"></i>Yes, Delete</>}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
