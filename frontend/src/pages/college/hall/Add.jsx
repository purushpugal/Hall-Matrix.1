import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../../api/axios'

export default function HallAdd() {
  const [form, setForm] = useState({ name: '', capacity: '', rows: '', cols: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/halls', form)
      navigate('/college/hall/list')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add hall. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Hall Management &rsaquo; <span>Add</span></div>
        <h5>Add Exam Hall</h5>
      </div>
      <Card className="ca-card" style={{ maxWidth: 560 }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-4"><i className="bi bi-grid-3x3-gap-fill text-success me-2"></i>Hall Details</h6>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Hall Name / Number</Form.Label>
              <Form.Control required name="name" placeholder="e.g. Hall A, Room 101" value={form.name} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Total Capacity (Seats)</Form.Label>
              <Form.Control required type="number" name="capacity" placeholder="e.g. 60" value={form.capacity} onChange={onChange} />
            </Form.Group>
            <Row className="g-3 mb-4">
              <Col><Form.Group>
                <Form.Label className="small fw-semibold">Rows</Form.Label>
                <Form.Control required type="number" name="rows" placeholder="e.g. 10" value={form.rows} onChange={onChange} />
              </Form.Group></Col>
              <Col><Form.Group>
                <Form.Label className="small fw-semibold">Columns</Form.Label>
                <Form.Control required type="number" name="cols" placeholder="e.g. 6" value={form.cols} onChange={onChange} />
              </Form.Group></Col>
            </Row>
            <div className="d-flex gap-2">
              <Button type="submit" variant="success" className="w-100 fw-semibold" disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-plus-square-fill me-2"></i>Add Hall</>}
              </Button>
              <Button as={Link} to="/college/hall/list" variant="light" className="w-100 fw-semibold">
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
