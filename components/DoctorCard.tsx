import Link from 'next/link'
import { Star, MapPin, Briefcase } from 'lucide-react'
import type { Doctor } from '@/lib/api'

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link href={`/book/${doctor.id}`} className="dcard">
      <div className="dcard-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={doctor.image || '/img27.jpg'} alt={doctor.name} loading="lazy" />
        {doctor.rating ? (
          <span className="dcard-rating">
            <span><Star size={13} fill="currentColor" /></span>
            {doctor.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      <div className="dcard-body">
        <span className="dcard-spec">{doctor.specialization}</span>
        <h3 className="dcard-name">{doctor.name}</h3>
        <div className="dcard-meta">
          {doctor.experience ? <span><Briefcase size={13} style={{ verticalAlign: '-2px' }} /> {doctor.experience} yrs</span> : null}
          {doctor.location ? <span><MapPin size={13} style={{ verticalAlign: '-2px' }} /> {doctor.location}</span> : null}
        </div>
        <div className="dcard-foot">
          <span className="dcard-fee">{doctor.fees ? `₹${doctor.fees}` : '—'} <small>/ visit</small></span>
          <span className="dcard-go">Book →</span>
        </div>
      </div>
    </Link>
  )
}
