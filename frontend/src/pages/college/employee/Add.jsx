import { Card } from 'react-bootstrap'
export default function EmployeeAdd() {
  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Employee Management &rsaquo; <span>Add</span></div>
        <h5>Add Employee</h5>
      </div>
      <Card className="ca-card"><Card.Body className="p-4">
        <div className="text-center py-4 text-muted">
          <i className="bi bi-person-plus-fill fs-1 d-block mb-3 text-success opacity-50"></i>
          <h6>Add Employee Form</h6>
          <p className="small">Employee registration form will be built here.</p>
        </div>
      </Card.Body></Card>
    </>
  )
}
