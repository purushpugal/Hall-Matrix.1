import { useState } from 'react'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_ROUTES = {
  super_admin:    '/super-admin/dashboard',
  admin_employee: '/super-admin/dashboard',
  college_admin:  '/college/dashboard',
  tutor:          '/college/dashboard',
  student:        '/student/dashboard',
}

export default function LoginModal({ show, onHide }) {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }

    setLoading(true)
    try {
      const user = await login(form.email.trim(), form.password)
      onHide()
      navigate(ROLE_ROUTES[user.role] || '/')
    } catch (err) {
      const msg = err?.response?.data?.errors?.email?.[0]
               || err?.response?.data?.message
               || 'Login failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setForm({ email: '', password: '' })
    setError('')
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-5">
          <i className="bi bi-box-arrow-in-right text-primary me-2"></i>
          Login to Hall Matrix
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4 pt-2">
        {error && (
          <Alert variant="danger" className="py-2 small">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Email / Username</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter your email or username"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-semibold">Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
                type="button"
              >
                <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
              </Button>
            </div>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-semibold"
            disabled={loading}
          >
            {loading
              ? <><Spinner size="sm" className="me-2" />Logging in…</>
              : <><i className="bi bi-box-arrow-in-right me-2"></i>Login</>
            }
          </Button>
        </Form>

        <p className="text-center text-muted small mt-3 mb-0">
          Not registered?{' '}
          <button
            className="btn btn-link btn-sm p-0 text-decoration-none"
            type="button"
            onClick={() => {
              handleClose()
              setTimeout(() => document.querySelector('.btn-register-college')?.click(), 200)
            }}
          >
            Register your college
          </button>
        </p>
      </Modal.Body>
    </Modal>
  )
}
