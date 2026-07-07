import { useEffect, useState } from 'react'
import { Card, Table, Badge, Spinner, Alert, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../../../api/axios'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEmployees = () => {
    setLoading(true)
    api.get('/employees')
      .then(res => setEmployees(res.data.employees))
      .catch(() => setError('Failed to load employees.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    try {
      await api.delete(`/employees/${id}`)
      setEmployees(employees.filter(e => e.id !== id))
    } catch (err) {
      alert('Failed to delete employee.')
    }
  }

  return (
    <>
      <div className="ca-page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <div className="ca-breadcrumb mb-1">Employee Management &rsaquo; <span>List</span></div>
          <h5 className="mb-0">All Employees</h5>
        </div>
        <Link to="/college/employee/add" className="btn btn-primary btn-sm fw-semibold">
          <i className="bi bi-plus-lg me-1"></i> Add Employee
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="ca-card">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No employees found. <Link to="/college/employee/add">Add one</Link>
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp.id}>
                    <td className="ps-4 fw-medium">{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>
                      <Badge bg={emp.role === 'tutor' ? 'info' : 'secondary'} className="text-uppercase">
                        {emp.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={emp.is_active ? 'success' : 'danger'}>
                        {emp.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(emp.id)}>
                        <i className="bi bi-trash"></i>
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
