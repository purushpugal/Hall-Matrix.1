import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// ── Landing page ─────────────────────────────────────────────────────────────
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import BenefitsSection from './components/BenefitsSection'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import RegisterCollegeModal from './components/RegisterCollegeModal'

// ── Super Admin ───────────────────────────────────────────────────────────────
import SuperAdminLayout    from './pages/superadmin/Layout'
import SuperAdminDashboard from './pages/superadmin/Dashboard'
import SuperAdminColleges  from './pages/superadmin/Colleges'

// ── College Admin ─────────────────────────────────────────────────────────────
import CollegeLayout    from './pages/college/Layout'
import CollegeDashboard from './pages/college/Dashboard'
import EmployeeAdd      from './pages/college/employee/Add'
import EmployeeList     from './pages/college/employee/List'
import StudentAdd       from './pages/college/student/Add'
import StudentList      from './pages/college/student/List'
import StudentView      from './pages/college/student/View'
import Degree           from './pages/college/student/settings/Degree'
import Department       from './pages/college/student/settings/Department'
import Batch            from './pages/college/student/settings/Batch'
import Subjects         from './pages/college/student/settings/Subjects'
import Semesters        from './pages/college/student/settings/Semesters'
import HallAdd          from './pages/college/hall/Add'
import HallList         from './pages/college/hall/List'
import ExamAdd          from './pages/college/exam/Add'
import ExamList         from './pages/college/exam/List'
import Reports          from './pages/college/Reports'

import './App.css'

function LandingPage() {
  const [showLogin,    setShowLogin]    = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      <HeroSection onLoginClick={() => setShowLogin(true)} />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <Footer />

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      <RegisterCollegeModal show={showRegister} onHide={() => setShowRegister(false)} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Super Admin */}
          <Route
            path="/super-admin"
            element={<ProtectedRoute role="super_admin"><SuperAdminLayout /></ProtectedRoute>}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="colleges"  element={<SuperAdminColleges />} />
          </Route>

          {/* College Admin */}
          <Route
            path="/college"
            element={<ProtectedRoute role="college_admin"><CollegeLayout /></ProtectedRoute>}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"                    element={<CollegeDashboard />} />

            {/* Employee */}
            <Route path="employee/add"                 element={<EmployeeAdd />} />
            <Route path="employee/list"                element={<EmployeeList />} />

            {/* Student */}
            <Route path="student/add"                  element={<StudentAdd />} />
            <Route path="student/list"                 element={<StudentList />} />
            <Route path="student/view/:id"              element={<StudentView />} />
            <Route path="student/settings/degree"      element={<Degree />} />
            <Route path="student/settings/department"  element={<Department />} />
            <Route path="student/settings/batch"       element={<Batch />} />
            <Route path="student/settings/subjects"    element={<Subjects />} />
            <Route path="student/settings/semesters"   element={<Semesters />} />

            {/* Hall */}
            <Route path="hall/add"                     element={<HallAdd />} />
            <Route path="hall/list"                    element={<HallList />} />

            {/* Exam */}
            <Route path="exam/add"                     element={<ExamAdd />} />
            <Route path="exam/list"                    element={<ExamList />} />

            {/* Reports */}
            <Route path="reports"                      element={<Reports />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
