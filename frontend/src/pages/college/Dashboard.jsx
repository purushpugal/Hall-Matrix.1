import { useEffect, useState } from 'react'
import { Card, Row, Col, Badge, Table, ProgressBar } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const STATS = [
  { key: 'students',   label: 'Total Students',    icon: 'bi-person-fill',         bg: 'bg-primary bg-opacity-10 text-primary' },
  { key: 'halls',      label: 'Exam Halls',         icon: 'bi-grid-3x3-gap-fill',   bg: 'bg-success bg-opacity-10 text-success' },
  { key: 'exams',      label: 'Scheduled Exams',    icon: 'bi-journal-text',         bg: 'bg-warning bg-opacity-10 text-warning' },
  { key: 'allocated',  label: 'Seats Allocated',    icon: 'bi-diagram-3-fill',       bg: 'bg-info    bg-opacity-10 text-info'    },
]

const QUICK_ACTIONS = [
  { icon: 'bi-person-plus-fill',  label: 'Add Students',       color: 'primary', to: '/college/students'   },
  { icon: 'bi-grid-3x3-gap',     label: 'Manage Halls',       color: 'success', to: '/college/halls'      },
  { icon: 'bi-journal-plus',     label: 'Schedule Exam',      color: 'warning', to: '/college/exams'      },
  { icon: 'bi-diagram-3-fill',   label: 'Generate Seating',   color: 'info',    to: '/college/allocation' },
  { icon: 'bi-printer-fill',     label: 'Print Seating Chart',color: 'dark',    to: '/college/reports'    },
]

export default function CollegeDashboard() {
  const { user } = useAuth()
  const [collegeInfo, setCollegeInfo] = useState(null)

  useEffect(() => {
    api.get('/college/info').catch(() => {})
  }, [])

  const counts = { students: 0, halls: 0, exams: 0, allocated: 0 }

  return (
    <>
      {/* Page header */}
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">College Dashboard</h4>
          <p className="text-muted small mb-0">
            Welcome, <strong>{user?.name}</strong> — manage your exam hall allocations here.
          </p>
        </div>
        <div className="text-end">
          <div className="small text-muted">
            <i className="bi bi-calendar3 me-1"></i>
            {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </div>
        </div>
      </div>

      {/* College info banner */}
      <div
        className="rounded-3 text-white p-4 mb-4 d-flex align-items-center gap-4 flex-wrap"
        style={{ background: 'linear-gradient(135deg, #0f4c35 0%, #1a7a52 100%)' }}
      >
        <div
          className="rounded-3 bg-white bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 64, height: 64, fontSize: '1.8rem' }}
        >
          <i className="bi bi-building-fill"></i>
        </div>
        <div className="flex-grow-1">
          <h5 className="fw-bold mb-1">Christain College of Engineering and Technology</h5>
          <div className="d-flex flex-wrap gap-3 opacity-75 small">
            <span><i className="bi bi-geo-alt-fill me-1"></i>Oddanchatram</span>
            <span><i className="bi bi-hash me-1"></i>Code: 9203</span>
            <span><i className="bi bi-envelope-fill me-1"></i>christain</span>
          </div>
        </div>
        <Badge bg="success" className="px-3 py-2 rounded-pill fs-6">
          <i className="bi bi-check-circle-fill me-1"></i>Active
        </Badge>
      </div>

      {/* Stat cards */}
      <Row className="g-4 mb-4">
        {STATS.map(({ key, label, icon, bg }) => (
          <Col key={key} sm={6} xl={3}>
            <Card className="ca-card h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className={`ca-stat-icon ${bg}`}>
                    <i className={`bi ${icon}`}></i>
                  </div>
                </div>
                <div className="fs-1 fw-bold lh-1 mb-1">{counts[key]}</div>
                <div className="text-muted small">{label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* Quick actions */}
        <Col lg={5}>
          <Card className="ca-card h-100">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-4">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Quick Actions
              </h6>
              <div className="d-flex flex-column gap-2">
                {QUICK_ACTIONS.map(({ icon, label, color, to }) => (
                  <a
                    key={label}
                    href={to}
                    className={`btn btn-outline-${color} text-start d-flex align-items-center gap-2`}
                  >
                    <i className={`bi ${icon}`}></i>{label}
                  </a>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Exam hall capacity overview */}
        <Col lg={7}>
          <Card className="ca-card h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-grid-3x3-gap text-success me-2"></i>Exam Hall Overview
                </h6>
                <a href="/college/halls" className="btn btn-sm btn-outline-success">Manage Halls</a>
              </div>

              <div className="text-center py-4 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
                <p className="small">No exam halls added yet.</p>
                <a href="/college/halls" className="btn btn-sm btn-success">
                  <i className="bi bi-plus-lg me-1"></i>Add First Hall
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent exam allocations */}
        <Col xs={12}>
          <Card className="ca-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-diagram-3-fill text-info me-2"></i>Recent Seat Allocations
                </h6>
                <a href="/college/allocation" className="btn btn-sm btn-outline-info">View All</a>
              </div>

              <Table className="ca-table mb-0" responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Exam Name</th>
                    <th>Date</th>
                    <th>Hall</th>
                    <th>Students</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-5">
                      <i className="bi bi-clipboard-x fs-2 d-block mb-2 opacity-25"></i>
                      No allocations generated yet. Schedule an exam to get started.
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
