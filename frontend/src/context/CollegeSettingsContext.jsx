import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const CollegeSettingsContext = createContext(null)

export function CollegeSettingsProvider({ children }) {
  const [degrees, setDegrees]         = useState([])
  const [departments, setDepartments] = useState([])
  const [batches, setBatches]         = useState([])
  const [subjects, setSubjects]       = useState([])
  const [semesters, setSemesters]     = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/degrees').then(res => setDegrees(res.data.degrees)),
      api.get('/departments').then(res => setDepartments(res.data.departments)),
      api.get('/batches').then(res => setBatches(res.data.batches)),
      api.get('/subjects').then(res => setSubjects(res.data.subjects)),
      api.get('/semesters').then(res => setSemesters(res.data.semesters)),
    ]).finally(() => setLoading(false))
  }, [])

  // ── Degrees ──────────────────────────────────────────────────────────────
  async function addDegree(name) {
    const res = await api.post('/degrees', { name: name.trim() })
    setDegrees(prev => [...prev, res.data.degree].sort((a, b) => a.name.localeCompare(b.name)))
  }

  async function updateDegree(id, name) {
    const res = await api.put(`/degrees/${id}`, { name: name.trim() })
    setDegrees(prev => prev.map(d => (d.id === id ? res.data.degree : d)))
    setDepartments(prev => prev.map(d => (d.degree_id === id ? { ...d, degreeName: res.data.degree.name } : d)))
  }

  async function removeDegree(id) {
    await api.delete(`/degrees/${id}`)
    setDegrees(prev => prev.filter(d => d.id !== id))
  }

  // ── Departments ──────────────────────────────────────────────────────────
  async function addDepartment(degreeId, name) {
    const res = await api.post('/departments', { degree_id: degreeId, name: name.trim() })
    setDepartments(prev => [...prev, res.data.department])
    setDegrees(prev => prev.map(d => (d.id === degreeId ? { ...d, departments_count: (d.departments_count ?? 0) + 1 } : d)))
  }

  async function updateDepartment(id, degreeId, name) {
    const res = await api.put(`/departments/${id}`, { degree_id: degreeId, name: name.trim() })
    setDepartments(prev => prev.map(d => (d.id === id ? res.data.department : d)))
  }

  async function removeDepartment(id) {
    const dept = departments.find(d => d.id === id)
    await api.delete(`/departments/${id}`)
    setDepartments(prev => prev.filter(d => d.id !== id))
    if (dept) {
      setDegrees(prev => prev.map(d => (d.id === dept.degree_id ? { ...d, departments_count: Math.max(0, (d.departments_count ?? 1) - 1) } : d)))
    }
  }

  // ── Batches ──────────────────────────────────────────────────────────────
  async function addBatch(fromYear, toYear) {
    const res = await api.post('/batches', { from_year: fromYear, to_year: toYear })
    setBatches(prev => [res.data.batch, ...prev])
  }

  async function updateBatch(id, fromYear, toYear) {
    const res = await api.put(`/batches/${id}`, { from_year: fromYear, to_year: toYear })
    setBatches(prev => prev.map(b => (b.id === id ? res.data.batch : b)))
  }

  async function removeBatch(id) {
    await api.delete(`/batches/${id}`)
    setBatches(prev => prev.filter(b => b.id !== id))
  }

  // ── Subjects ─────────────────────────────────────────────────────────────
  async function addSubject(code, name) {
    const res = await api.post('/subjects', { code: code.trim(), name: name.trim() })
    setSubjects(prev => [...prev, res.data.subject].sort((a, b) => a.code.localeCompare(b.code)))
  }

  async function updateSubject(id, code, name) {
    const res = await api.put(`/subjects/${id}`, { code: code.trim(), name: name.trim() })
    setSubjects(prev => prev.map(s => (s.id === id ? res.data.subject : s)))
  }

  async function removeSubject(id) {
    await api.delete(`/subjects/${id}`)
    setSubjects(prev => prev.filter(s => s.id !== id))
  }

  // ── Semesters ────────────────────────────────────────────────────────────
  async function addSemester(degreeId, departmentId, batchId, semesterNumber, subjectIds) {
    const res = await api.post('/semesters', {
      degree_id: degreeId,
      department_id: departmentId,
      batch_id: batchId,
      semester_number: semesterNumber,
      subject_ids: subjectIds,
    })
    setSemesters(prev => [res.data.semester, ...prev])
  }

  async function removeSemester(id) {
    await api.delete(`/semesters/${id}`)
    setSemesters(prev => prev.filter(s => s.id !== id))
  }

  return (
    <CollegeSettingsContext.Provider value={{
      loading,
      degrees,     addDegree,     updateDegree,     removeDegree,
      departments, addDepartment, updateDepartment, removeDepartment,
      batches,     addBatch,      updateBatch,      removeBatch,
      subjects,    addSubject,    updateSubject,    removeSubject,
      semesters,   addSemester,   removeSemester,
    }}>
      {children}
    </CollegeSettingsContext.Provider>
  )
}

export function useCollegeSettings() {
  return useContext(CollegeSettingsContext)
}
