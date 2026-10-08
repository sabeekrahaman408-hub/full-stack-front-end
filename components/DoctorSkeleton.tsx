export default function DoctorSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="doctor-gallery" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="dcard skeleton-card" key={i}>
          <div className="dcard-photo skeleton" />
          <div className="dcard-body">
            <div className="skeleton" style={{ height: 12, width: '40%' }} />
            <div className="skeleton" style={{ height: 22, width: '70%' }} />
            <div className="skeleton" style={{ height: 12, width: '55%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
