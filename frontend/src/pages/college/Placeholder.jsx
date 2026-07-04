export default function Placeholder({ icon, title, section, description }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div
        className="rounded-4 bg-success bg-opacity-10 text-success mb-4 d-flex align-items-center justify-content-center"
        style={{ width: 80, height: 80, fontSize: '2rem' }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="fw-bold mb-1">{title}</h5>
      <p className="text-muted small mb-0" style={{ maxWidth: 340 }}>
        {description ?? `This is the ${title} section. Implementation coming soon.`}
      </p>
    </div>
  )
}
