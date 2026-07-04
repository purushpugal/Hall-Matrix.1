import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import api from '../../../api/axios'

export default function ExamAdd() {
  const [date, setDate] = useState('')
  const [allocations, setAllocations] = useState([
    { subject_id: '', present_batch_reg: '', previous_batch_reg: '' }
  ])
  const [hall_id, setHallId] = useState('')
  const [allocation_method, setAllocationMethod] = useState('strict_no_adjacent')
  
  const [subjects, setSubjects] = useState([])
  const [halls, setHalls] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    Promise.all([
      api.get('/subjects').catch(() => ({ data: { subjects: [] } })),
      api.get('/halls').catch(() => ({ data: { halls: [] } }))
    ]).then(([subRes, hallRes]) => {
      setSubjects(subRes.data.subjects || [])
      setHalls(hallRes.data.halls || [])
      setLoadingData(false)
    })
  }, [])

  const handleAllocationChange = async (index, field, value) => {
    const newAllocs = [...allocations]
    newAllocs[index][field] = value
    
    if (field === 'subject_id' && value) {
      try {
        const res = await api.get(`/subjects/${value}/students`)
        newAllocs[index].present_batch_reg = res.data.present_batch.join(', ')
        newAllocs[index].previous_batch_reg = res.data.previous_batch.join(', ')
      } catch (e) {
        console.error('Failed to fetch students for subject', e)
      }
    }
    
    setAllocations(newAllocs)
  }

  const addSubjectRow = () => {
    setAllocations([...allocations, { subject_id: '', present_batch_reg: '', previous_batch_reg: '' }])
  }

  const removeSubjectRow = (index) => {
    const newAllocs = [...allocations]
    newAllocs.splice(index, 1)
    setAllocations(newAllocs)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      alert('Allocation settings prepared for multiple subjects! (Backend integration pending)')
      setSaving(false)
    }, 800)
  }

  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Exam Schedule &rsaquo; <span>Allocate</span></div>
        <h5>Exam Hall Allocation</h5>
      </div>
      
      <Card className="ca-card" style={{ maxWidth: 800 }}>
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-4"><i className="bi bi-person-lines-fill text-primary me-2"></i>Allocation Details</h6>
          
          {loadingData ? (
            <div className="text-center py-4"><Spinner animation="border" /></div>
          ) : (
            <Form onSubmit={handleSubmit}>
              
              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold">Exam Date</Form.Label>
                <Form.Control type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={{ maxWidth: 200 }} />
              </Form.Group>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="small fw-semibold mb-0">Subjects &amp; Students to Allocate</Form.Label>
                </div>
                
                {allocations.map((alloc, index) => (
                  <div key={index} className="p-3 border rounded mb-3 bg-light">
                    <Row className="g-3 align-items-end">
                      <Col md={12}>
                        <div className="d-flex justify-content-between">
                          <label className="small fw-bold text-muted mb-1">Subject {index + 1}</label>
                          {allocations.length > 1 && (
                            <button type="button" className="btn btn-link text-danger p-0 border-0 text-decoration-none" onClick={() => removeSubjectRow(index)}>
                              <i className="bi bi-trash"></i> Remove
                            </button>
                          )}
                        </div>
                        <Form.Select required value={alloc.subject_id} onChange={(e) => handleAllocationChange(index, 'subject_id', e.target.value)}>
                          <option value="">-- Select Subject --</option>
                          {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="small text-muted mb-1">Present Batch Register Nos</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={2}
                          placeholder="e.g. REG001-REG050, REG055" 
                          required 
                          value={alloc.present_batch_reg} 
                          onChange={(e) => handleAllocationChange(index, 'present_batch_reg', e.target.value)} 
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="small text-muted mb-1">Previous Batch Register Nos</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={2}
                          placeholder="e.g. REG18-001, REG18-012" 
                          value={alloc.previous_batch_reg} 
                          onChange={(e) => handleAllocationChange(index, 'previous_batch_reg', e.target.value)} 
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
                
                <Button variant="outline-primary" size="sm" onClick={addSubjectRow}>
                  <i className="bi bi-plus-circle me-1"></i> Add Another Subject
                </Button>
              </div>
              
              <Row className="g-3 mb-4 pt-3 border-top">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold">Exam Hall</Form.Label>
                    <Form.Select required value={hall_id} onChange={(e) => setHallId(e.target.value)}>
                      <option value="">-- Select Hall --</option>
                      {halls.map(h => <option key={h.id} value={h.id}>{h.name} (Cap: {h.capacity})</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold">Allocation Method</Form.Label>
                    <Form.Select required value={allocation_method} onChange={(e) => setAllocationMethod(e.target.value)}>
                      <option value="strict_no_adjacent">Strict No-Adjacent (No same dept Front/Back/Left/Right)</option>
                      <option value="w_pattern">W Pattern</option>
                      <option value="no_side_adjacent">No Side-Adjacent (No same dept Left/Right)</option>
                      <option value="same_dept_custom">Same Department Custom (1 3 4 / 6 7 8 / 9 10 11)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Button type="submit" variant="primary" className="w-100 fw-semibold" disabled={saving}>
                {saving ? <Spinner size="sm" /> : <><i className="bi bi-check2-circle me-2"></i>Allocate Students</>}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </>
  )
}
