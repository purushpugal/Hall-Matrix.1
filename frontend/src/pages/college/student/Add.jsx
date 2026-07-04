import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Button, Row, Col, Alert, InputGroup, Spinner, Image } from 'react-bootstrap'
import { useCollegeSettings } from '../../../context/CollegeSettingsContext'
import api from '../../../api/axios'

const initial = {
  name: '', phone: '', email: '', password: '',
  register_no: '', degree_id: '', department_id: '', batch_id: '',
}

export default function StudentAdd() {
  const navigate = useNavigate()
  const { degrees, departments, batches } = useCollegeSettings()

  const [form, setForm]         = useState(initial)
  const [photo, setPhoto]       = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess]   = useState(false)

  const availableDepartments = departments.filter(d => String(d.degree_id) === String(form.degree_id))

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'degree_id') next.department_id = ''
      return next
    })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0] ?? null
    setPhoto(file)
    setErrors(prev => ({ ...prev, profile_photo: '' }))
    setPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number.'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (!form.register_no.trim()) errs.register_no = 'Register number is required.'
    if (!form.degree_id) errs.degree_id = 'Select a degree.'
    if (!form.department_id) errs.department_id = 'Select a department.'
    if (!form.batch_id) errs.batch_id = 'Select a batch.'
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
      const fd = new FormData()
      Object.entries(form).forEach(([key, value]) => fd.append(key, value))
      if (photo) fd.append('profile_photo', photo)

      await api.post('/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } })

      setSuccess(true)
      setForm(initial)
      setPhoto(null)
      setPhotoPreview(null)
      setTimeout(() => navigate('/college/student/list'), 1500)
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
        <div className="ca-breadcrumb mb-1">Student Management &rsaquo; <span>Add</span></div>
        <h5>Add Student</h5>
      </div>

      {success && (
        <Alert variant="success">
          <i className="bi bi-check-circle-fill me-2"></i>
          Student added successfully. Redirecting to the list…
        </Alert>
      )}
      {serverError && (
        <Alert variant="danger" className="py-2 small">{serverError}</Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Row className="g-4">
          {/* Personal Info */}
          <Col lg={6}>
            <Card className="ca-card h-100">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-person-vcard-fill text-primary me-2"></i>Personal Info
                </h6>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-circle bg-light border d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                    style={{ width: 64, height: 64 }}
                  >
                    {photoPreview
                      ? <Image src={photoPreview} width={64} height={64} style={{ objectFit: 'cover' }} />
                      : <i className="bi bi-person-fill text-muted fs-3"></i>}
                  </div>
                  <div className="flex-grow-1">
                    <Form.Label className="small fw-semibold mb-1">Profile Photo</Form.Label>
                    <Form.Control type="file" accept="image/*" size="sm" onChange={handlePhoto} isInvalid={!!errors.profile_photo} />
                    <Form.Control.Feedback type="invalid">{errors.profile_photo}</Form.Control.Feedback>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} isInvalid={!!errors.name} placeholder="Full name" />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Phone <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text>+91</InputGroup.Text>
                    <Form.Control name="phone" value={form.phone} onChange={handleChange} isInvalid={!!errors.phone} maxLength={10} placeholder="10-digit mobile number" />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} isInvalid={!!errors.email} placeholder="student@example.com" autoComplete="email" />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="small fw-semibold">Password <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                    />
                    <Button variant="outline-secondary" tabIndex={-1} onClick={() => setShowPassword(v => !v)}>
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* College Info */}
          <Col lg={6}>
            <Card className="ca-card h-100">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-mortarboard-fill text-success me-2"></i>College Info
                </h6>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Register No <span className="text-danger">*</span></Form.Label>
                  <Form.Control name="register_no" value={form.register_no} onChange={handleChange} isInvalid={!!errors.register_no} placeholder="e.g. 9203CS001" />
                  <Form.Control.Feedback type="invalid">{errors.register_no}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Degree <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="degree_id" value={form.degree_id} onChange={handleChange} isInvalid={!!errors.degree_id}>
                    <option value="">-- Select Degree --</option>
                    {degrees.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.degree_id}</Form.Control.Feedback>
                  {degrees.length === 0 && <div className="form-text text-warning small">No degrees set up yet — add one under Settings &rsaquo; Degree.</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Department <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                    isInvalid={!!errors.department_id}
                    disabled={!form.degree_id}
                  >
                    <option value="">-- Select Department --</option>
                    {availableDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.department_id}</Form.Control.Feedback>
                  {form.degree_id && availableDepartments.length === 0 && (
                    <div className="form-text text-warning small">No departments under this degree yet.</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">Batch <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="batch_id" value={form.batch_id} onChange={handleChange} isInvalid={!!errors.batch_id}>
                    <option value="">-- Select Batch --</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.from_year} - {b.to_year}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.batch_id}</Form.Control.Feedback>
                  {batches.length === 0 && <div className="form-text text-warning small">No batches set up yet — add one under Settings &rsaquo; Batch.</div>}
                </Form.Group>

                <Button type="submit" variant="success" className="w-100" disabled={submitting}>
                  {submitting ? <><Spinner animation="border" size="sm" className="me-2" />Adding…</> : <><i className="bi bi-person-plus-fill me-2"></i>Add Student</>}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  )
}
