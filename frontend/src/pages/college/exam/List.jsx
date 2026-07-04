import { Card, Table, Badge, Button } from 'react-bootstrap'
export default function ExamList() {
  return (
    <>
      <div className="ca-page-header">
        <div className="ca-breadcrumb mb-1">Exam Schedule &rsaquo; <span>List</span></div>
        <h5>Exam Schedule List</h5>
      </div>
      <Card className="ca-card"><Card.Body className="p-4">
        <div className="d-flex justify-content-end mb-3">
          <a href="/college/exam/add" className="btn btn-success btn-sm">
            <i className="bi bi-plus-lg me-1"></i>Schedule Exam
          </a>
        </div>
        <Table className="ca-table mb-0" responsive hover>
          <thead><tr><th>#</th><th>Exam Name</th><th>Date</th><th>Time</th><th>Hall</th><th>Students</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td colSpan={8} className="text-center text-muted py-5">
              <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>No exams scheduled yet.
            </td></tr>
          </tbody>
        </Table>
      </Card.Body></Card>
    </>
  )
}
