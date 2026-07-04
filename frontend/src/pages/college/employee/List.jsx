import { Card, Table, Badge } from 'react-bootstrap'
export default function EmployeeList() {
  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Employee Management &rsaquo; <span>List</span></div>
        <h5>Employee List</h5>
      </div>
      <Card className="ca-card"><Card.Body className="p-4">
        <Table className="ca-table mb-0" responsive hover>
          <thead><tr><th>#</th><th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td colSpan={6} className="text-center text-muted py-5">
              <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>No employees added yet.
            </td></tr>
          </tbody>
        </Table>
      </Card.Body></Card>
    </>
  )
}
