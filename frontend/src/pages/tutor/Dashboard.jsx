import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Table, Badge, Spinner, Alert, Button, InputGroup, Form } from 'react-bootstrap'
import api from '../../api/axios'

export default function TutorDashboard() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchStudents = () => {
    setLoading(true)
    api.get('/students')
      .then(res => setStudents(res.data.students))
      .catch(() => setError('Failed to load your assigned students.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.register_no.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="ca-page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <div className="ca-breadcrumb mb-1">Tutor Portal &rsaquo; <span>My Students</span></div>
          <h5 className="mb-0">Assigned Students ({students.length})</h5>
        </div>
        <div style={{ maxWidth: 300, width: '100%' }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="Search by name or reg no..." value={search} onChange={e => setSearch(e.target.value)} />
          </InputGroup>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="ca-card">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Student</th>
                <th>Contact</th>
                <th>Degree / Dept</th>
                <th>Batch</th>
                <th>Status</th>
                <th className="pe-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No students assigned or found.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, overflow: 'hidden' }}>
                          {s.photo_url ? <img src={s.photo_url} alt="" width={40} height={40} style={{ objectFit: 'cover' }} /> : <i className="bi bi-person-fill text-muted"></i>}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{s.name}</div>
                          <div className="small text-muted">{s.register_no}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small">{s.email}</div>
                      <div className="small text-muted">{s.phone}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{s.degree}</div>
                      <div className="small text-muted">{s.department}</div>
                    </td>
                    <td><Badge bg="light" text="dark" className="border fw-medium">{s.batch}</Badge></td>
                    <td>
                      <Badge bg={s.is_active ? 'success' : 'danger'}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <Button as={Link} to={`/tutor/student/view/${s.id}`} variant="light" size="sm" className="text-primary fw-semibold">
                        View &amp; Update
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  )
}
