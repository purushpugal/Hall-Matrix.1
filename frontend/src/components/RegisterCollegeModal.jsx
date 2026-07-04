import { useState } from 'react'
import { Modal, Form, Button, Alert, Row, Col, InputGroup, Spinner } from 'react-bootstrap'
import api from '../api/axios'

const initial = {
  collegeName: '',
  collegeCode: '',
  contactPerson: '',
  contactNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
}

// Maps backend validation field names to the form's camelCase field names.
const BACKEND_FIELD_MAP = {
  college_name: 'collegeName',
  college_code: 'collegeCode',
  contact_person: 'contactPerson',
  contact_number: 'contactNumber',
  email: 'email',
  password: 'password',
}

export default function RegisterCollegeModal({ show, onHide }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.collegeName.trim()) errs.collegeName = 'College name is required.'
    if (!form.collegeCode.trim()) errs.collegeCode = 'College code is required.'
    if (!form.contactPerson.trim()) errs.contactPerson = 'Contact person name is required.'
    if (!/^\d{10}$/.test(form.contactNumber)) errs.contactNumber = 'Enter a valid 10-digit mobile number.'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
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
      await api.post('/colleges', {
        college_name: form.collegeName,
        college_code: form.collegeCode,
        contact_person: form.contactPerson,
        contact_number: form.contactNumber,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      })

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setForm(initial)
        onHide()
      }, 2500)
    } catch (err) {
      const backendErrors = err.response?.data?.errors
      if (backendErrors) {
        const mapped = {}
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const key = BACKEND_FIELD_MAP[field] || field
          mapped[key] = messages[0]
        })
        setErrors(mapped)
      } else {
        setServerError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    setForm(initial)
    setErrors({})
    setServerError('')
    setSuccess(false)
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <i className="bi bi-building-add text-warning me-2"></i>
          Register Your College
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-2">
        <p className="text-muted small mb-4">
          Create an account to start managing exam hall seat allocation for your college.
        </p>

        {success && (
          <Alert variant="success" className="text-center">
            <i className="bi bi-check-circle-fill me-2"></i>
            Registration successful! You can now log in to manage your college.
          </Alert>
        )}

        {!success && (
          <Form onSubmit={handleSubmit} noValidate>
            {serverError && (
              <Alert variant="danger" className="py-2 small">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{serverError}
              </Alert>
            )}
            <Row className="g-3">
              {/* College Name */}
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">
                    College Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="collegeName"
                    placeholder="e.g. Sri Venkateswara College of Engineering"
                    value={form.collegeName}
                    onChange={handleChange}
                    isInvalid={!!errors.collegeName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.collegeName}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* College Code */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">
                    College Code <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="collegeCode"
                    placeholder="e.g. SVCE001"
                    value={form.collegeCode}
                    onChange={handleChange}
                    isInvalid={!!errors.collegeCode}
                  />
                  <Form.Control.Feedback type="invalid">{errors.collegeCode}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Contact Person */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">
                    Contact Person <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="contactPerson"
                    placeholder="Full name of the exam coordinator"
                    value={form.contactPerson}
                    onChange={handleChange}
                    isInvalid={!!errors.contactPerson}
                  />
                  <Form.Control.Feedback type="invalid">{errors.contactPerson}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Contact Number */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">
                    Contact Number <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>+91</InputGroup.Text>
                    <Form.Control
                      name="contactNumber"
                      placeholder="10-digit mobile number"
                      value={form.contactNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.contactNumber}
                      maxLength={10}
                    />
                    <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              {/* Email */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">
                    Official Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="examcell@yourcollege.edu.in"
                    value={form.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    autoComplete="email"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Password */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      autoComplete="new-password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              {/* Confirm Password */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid mt-4">
              <Button type="submit" variant="warning" size="lg" className="fw-bold" disabled={submitting}>
                {submitting ? (
                  <><Spinner animation="border" size="sm" className="me-2" />Registering…</>
                ) : (
                  <><i className="bi bi-building-add me-2"></i>Register College</>
                )}
              </Button>
            </div>

            <p className="text-center text-muted small mt-3">
              <i className="bi bi-lock-fill me-1"></i>
              Your data is secure and will only be used for Hall Matrix services.
            </p>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}
