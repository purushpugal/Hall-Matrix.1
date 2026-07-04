import { Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axios'

export default function HallList() {
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHalls()
  }, [])

  const fetchHalls = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/halls')
      setHalls(res.data.halls)
    } catch (err) {
      setError('Failed to fetch halls.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hall?')) return
    try {
      await api.delete(`/halls/${id}`)
      fetchHalls()
    } catch (err) {
      alert('Failed to delete hall.')
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Hall Management &rsaquo; <span>List</span></div>
        <h5>Exam Hall List</h5>
      </div>
      <Card className="ca-card"><Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 fw-bold">All Halls</h6>
          <Link to="/college/hall/add" className="btn btn-success btn-sm">
            <i className="bi bi-plus-lg me-1"></i>Add Hall
          </Link>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Table className="ca-table mb-0" responsive hover>
          <thead><tr><th>#</th><th>Hall Name</th><th>Capacity</th><th>Rows</th><th>Columns</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-5"><Spinner animation="border" /></td></tr>
            ) : halls.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-muted py-5">
                <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>No halls added yet.
              </td></tr>
            ) : (
              halls.map((hall, index) => (
                <tr key={hall.id}>
                  <td>{index + 1}</td>
                  <td className="fw-semibold text-primary">{hall.name}</td>
                  <td>{hall.capacity}</td>
                  <td>{hall.rows}</td>
                  <td>{hall.cols}</td>
                  <td>
                    <Badge bg={hall.is_active ? 'success' : 'danger'}>
                      {hall.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(hall.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body></Card>
    </>
  )
}
