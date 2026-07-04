import { useEffect, useState } from 'react'
import { Card, Row, Col, Badge, Table } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const USER_ROLES = [
  { role: 'Super Admin',     count: 1, color: 'danger'  },
  { role: 'Admin Employee',  count: 0, color: 'warning' },
  { role: 'College Admin',   count: 0, color: 'primary' },
  { role: 'Tutor',           count: 0, color: 'info'    },
  { role: 'Student',         count: 0, color: 'success' },
]

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const [colleges, setColleges] = useState([])

  useEffect(() => {
    api.get('/colleges')
      .then(res => setColleges(res.data.colleges))
      .catch(() => {})
  }, [])

  const recentColleges = colleges.slice(0, 5)

  const STATS = [
    { label: 'Total Colleges',  value: colleges.length, icon: 'bi-building-fill',    bg: 'bg-primary bg-opacity-10 text-primary',  change: 'Registered colleges' },
    { label: 'Total Students',  value: 0, icon: 'bi-person-fill',         bg: 'bg-success bg-opacity-10 text-success',  change: '+0 this month' },
    { label: 'Exam Halls',      value: 0, icon: 'bi-grid-3x3-gap-fill',   bg: 'bg-warning bg-opacity-10 text-warning',  change: 'Registered halls' },
    { label: 'Active Exams',    value: 0, icon: 'bi-journal-check',        bg: 'bg-danger  bg-opacity-10 text-danger',   change: 'Ongoing sessions' },
  ]

  return (
    <>
      {/* Page header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-0">Dashboard</h4>
          <p className="text-muted small mb-0">
            Welcome back, <strong>{user?.name}</strong> — here's your system overview.
          </p>
        </div>
        <div className="text-muted small">
          <i className="bi bi-calendar3 me-1"></i>
          {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </div>
      </div>

      {/* Stat cards */}
      <Row className="g-4 mb-4">
        {STATS.map(({ label, value, icon, bg, change }) => (
          <Col key={label} sm={6} xl={3}>
            <Card className="stat-card h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className={`stat-icon ${bg}`}>
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <span className="badge bg-light text-muted rounded-pill small">{change}</span>
                </div>
                <div className="fs-1 fw-bold lh-1 mb-1">{value}</div>
                <div className="text-muted small">{label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* User role breakdown */}
        <Col lg={5}>
          <Card className="stat-card h-100">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-4">
                <i className="bi bi-people-fill text-primary me-2"></i>User Role Breakdown
              </h6>
              {USER_ROLES.map(({ role, count, color }) => (
                <div key={role} className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg={color} className="rounded-pill px-2">&nbsp;</Badge>
                    <span className="small">{role}</span>
                  </div>
                  <span className="fw-bold">{count}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent colleges */}
        <Col lg={7}>
          <Card className="stat-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-building text-primary me-2"></i>Recent College Registrations
                </h6>
                <a href="/super-admin/colleges" className="btn btn-sm btn-outline-primary">View All</a>
              </div>

              <Table className="sa-table mb-0" responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>College Name</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentColleges.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>
                        No colleges registered yet
                      </td>
                    </tr>
                  ) : (
                    recentColleges.map((college, idx) => (
                      <tr key={college.id}>
                        <td>{idx + 1}</td>
                        <td>{college.college_name}</td>
                        <td>{college.college_code}</td>
                        <td>
                          <Badge bg={college.is_active ? 'success' : 'danger'} className="text-uppercase">
                            {college.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>{new Date(college.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick actions */}
        <Col xs={12}>
          <Card className="stat-card">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-4">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Quick Actions
              </h6>
              <div className="d-flex flex-wrap gap-3">
                {[
                  { icon: 'bi-building-add',    label: 'Add College',    color: 'primary' },
                  { icon: 'bi-person-plus-fill', label: 'Add User',       color: 'success' },
                  { icon: 'bi-grid-3x3-gap',    label: 'Manage Halls',   color: 'warning' },
                  { icon: 'bi-journal-plus',    label: 'New Exam',       color: 'danger'  },
                  { icon: 'bi-download',        label: 'Export Report',  color: 'info'    },
                ].map(({ icon, label, color }) => (
                  <button key={label} className={`btn btn-outline-${color} d-flex align-items-center gap-2`}>
                    <i className={`bi ${icon}`}></i>{label}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
