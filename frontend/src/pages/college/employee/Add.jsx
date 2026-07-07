import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Button, Row, Col, Alert, Spinner, InputGroup } from 'react-bootstrap'
import api from '../../../api/axios'

const initial = { name: '', phone: '', email: '', password: '', role: 'tutor' }

export default function EmployeeAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setServerError('')
    setSubmitting(true)
    try {
      await api.post('/employees', form)
      setSuccess(true)
      setForm(initial)
      setTimeout(() => navigate('/college/employee/list'), 1500)
    } catch (err) {
      const backendErrors = err.response?.data?.errors
      if (backendErrors) {
        const mapped = {}
        Object.entries(backendErrors).forEach(([field, messages]) => { mapped[field] = messages[0] })
        setErrors(mapped)
      } else {
        setServerError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Employee Management &rsaquo; <span>Add</span></div>
        <h5>Add Employee</h5>
      </div>

      {success && (
        <Alert variant="success">
          <i className="bi bi-check-circle-fill me-2"></i>
          Employee added successfully. Redirecting…
        </Alert>
      )}
      {serverError && <Alert variant="danger" className="py-2 small">{serverError}</Alert>}

      <Card className="ca-card" style={{ maxWidth: 600 }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-4">
            <i className="bi bi-person-badge-fill text-primary me-2"></i>Employee Details
          </h6>
          
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Role <span className="text-danger">*</span></Form.Label>
              <Form.Select name="role" value={form.role} onChange={handleChange}>
                <option value="tutor">Tutor</option>
                <option value="admin_employee">Admin Employee</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Name <span className="text-danger">*</span></Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} isInvalid={!!errors.name} placeholder="Full name" />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Email <span className="text-danger">*</span></Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} isInvalid={!!errors.email} placeholder="employee@example.com" />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold">Password <span className="text-danger">*</span></Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="Min. 8 characters"
                />
                <Button variant="outline-secondary" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </Button>
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
              {submitting ? <><Spinner animation="border" size="sm" className="me-2" />Saving…</> : <><i className="bi bi-person-plus-fill me-2"></i>Add Employee</>}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
