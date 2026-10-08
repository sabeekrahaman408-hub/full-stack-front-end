'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Doctor = {
  id: string
  name: string
  specialization: string
  availableDates: string[]
  image: string
  experience?: number
  location?: string
  fees?: number
  qualification?: string
  languages?: string
  availableDays?: string
  about?: string
}

// ---- field validation (same rules are enforced again by the server) ----
const NAME_RE = /^[\p{L}][\p{L} .'-]{1,49}$/u
const nameError = (v: string) =>
  !v.trim() ? 'Name is required' : !NAME_RE.test(v.trim()) ? 'Use letters only (at least 2 characters, no numbers)' : ''
const ageError = (v: string) =>
  !v ? 'Age is required' : !/^\d{1,2}$/.test(v) ? 'Age must be 1 or 2 digits' : Number(v) < 1 ? 'Age must be between 1 and 99' : ''
const contactError = (v: string) =>
  !v ? 'Contact number is required' : !/^[6-9]\d{9}$/.test(v) ? 'Enter a valid 10-digit mobile number (starts with 6, 7, 8 or 9)' : ''
const problemError = (v: string) =>
  v.trim().length < 5 ? 'Please describe the problem (at least 5 characters)' : ''


export default function Book() {
  const params = useParams()
  const router = useRouter()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [doctorLoaded, setDoctorLoaded] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState('')
  const [contact, setContact] = useState('')
  const [problem, setProblem] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [message, setMessage] = useState('')

  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Pending')

  // ✅ Card Payment Fields
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  // ✅ UPI Payment Fields
  const [upiId, setUpiId] = useState("")
  const [upiTransactionId, setUpiTransactionId] = useState("")
  const [upiPaid, setUpiPaid] = useState(false)

  const consultationFee = doctor?.fees || 500

  type Slot = { time: string; available: boolean; reason?: string | null }
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')

  // local date helpers (toISOString() is UTC and shows "yesterday" early morning in India)
  const pad = (n: number) => String(n).padStart(2, '0')
  const toYmd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const todayYmd = toYmd(new Date())
  const maxYmd = toYmd(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000))

  // load real availability (booked / already-passed slots are disabled) whenever doctor or date changes
  useEffect(() => {
    if (!date || !doctor) {
      setSlots([])
      return
    }
    let cancelled = false
    setSlotsLoading(true)
    setSlotsError('')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor.id}/slots?date=${date}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error(data?.message || 'Could not load time slots')
        if (!cancelled) setSlots(data)
      })
      .catch((e) => {
        if (!cancelled) {
          setSlots([])
          setSlotsError(e.message)
        }
      })
      .finally(() => !cancelled && setSlotsLoading(false))
    return () => { cancelled = true }
  }, [date, doctor])

  useEffect(() => {
    if (!params?.id) return

    const id = Array.isArray(params.id) ? params.id[0] : params.id

    const fetchDoctor = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`)
        if (res.ok) {
          const data = await res.json()
          setDoctor({
            ...data,
            availableDates: data.availableDates ? ["ALL"] : ["ALL"]
          })
          setDoctorLoaded(true)
          return
        }
      } catch (e) {
        console.error("Error fetching doctor:", e)
      }

      // doctors exist only in the MySQL database - nothing is stored in the browser or in files
      setDoctor(null)
      setDoctorLoaded(true)
    }

    fetchDoctor()
  }, [params])

  const errors: Record<string, string> = {
    patientName: nameError(patientName),
    age: ageError(age),
    contact: contactError(contact),
    problem: problemError(problem),
  }
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }))
  const showErr = (k: string) => (touched[k] && errors[k] ? errors[k] : '')

  const handleBook = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null")

    if (!user) {
      alert("Please login to book appointment!")
      router.push("/login")
      return
    }

    if (!date || !time || !doctor) {
      alert("Please select date and time")
      return
    }

    if (Object.values(errors).some(Boolean)) {
      setTouched({ patientName: true, age: true, contact: true, problem: true })
      alert("Please correct the highlighted patient details")
      return
    }

    if (!paymentMethod) {
      alert("Please select payment method!")
      return
    }

    // ✅ Validate Card Payment
    if (paymentMethod === "Card") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        alert("Please fill all Debit/Credit Card details!")
        return
      }

      if (cardNumber.length < 12) {
        alert("Please enter valid card number!")
        return
      }

      if (cvv.length !== 3) {
        alert("CVV must be 3 digits!")
        return
      }
    }

    // ✅ Validate UPI Payment
    if (paymentMethod === "UPI") {
      if (!upiId) {
        alert("Please enter UPI ID!")
        return
      }

      if (!upiId.includes("@")) {
        alert("Invalid UPI ID! Example: name@upi")
        return
      }

      if (!upiTransactionId) {
        alert("Please enter Transaction ID!")
        return
      }

      if (!upiPaid) {
        alert("Please complete UPI payment by clicking Pay Now!")
        return
      }
    }

    setPaymentStatus("Paid")

    const newAppointment = {
      doctor: doctor.name,
      specialization: doctor.specialization,
      date,
      time,
      patientName: patientName.trim().replace(/\s+/g, ' '),
      age: Number(age),
      contact,
      problem: problem.trim(),
      email: user.email,
      consultationFee,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash" ? "Pending" : "Paid",
      status: "pending", // New field for admin approval
      createdAt: new Date().toISOString(),
      requestedBy: user.email,
      type: "in-person", // Default type

      // Payment Details (Demo)
      paymentDetails:
        paymentMethod === "Card"
          ? {
              cardNumber,
              cardName,
              expiry,
            }
          : paymentMethod === "UPI"
          ? {
              upiId,
              transactionId: upiTransactionId,
            }
          : null,
    }

    try {
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      // Add new appointment with backend validation & duplicate detection
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: "POST",
        headers,
        body: JSON.stringify(newAppointment),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Error booking appointment!")
        return
      }

      setMessage(
        `Appointment request sent to ${doctor.name} for ${date} at ${time} | ${paymentMethod === "Cash" ? "Payment pending" : "Payment successful"} | Awaiting doctor approval`
      )

      // Reset
      setDate('')
      setTime('')
      setSlots([])
      setPatientName('')
      setAge('')
      setTouched({})
      setContact('')
      setProblem('')
      setPaymentMethod('')
      setPaymentStatus('Pending')

      // Clear Card
      setCardNumber("")
      setCardName("")
      setExpiry("")
      setCvv("")

      // Clear UPI
      setUpiId("")
      setUpiTransactionId("")
      setUpiPaid(false)

    } catch {
      alert("Error booking appointment! Please make sure the Spring Boot backend is running.")
    }
  }

  if (!doctor) {
    return doctorLoaded ? (
      <div className="empty">
        <h3>Doctor not found</h3>
        <p>We could not load this doctor. Check that the backend and MySQL are running, then try again.</p>
        <a href="/doctors" className="btn btn-primary" style={{ marginTop: 14 }}>Back to all doctors</a>
      </div>
    ) : (
      <p className="muted">Loading doctor…</p>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="doctor-profile">
          <img src={doctor.image} alt={doctor.name} className="doctor-img" />

          <div className="doctor-info">
            <h2>{doctor.name}</h2>
            <p>{doctor.specialization}{(doctor as any).qualification ? ` · ${(doctor as any).qualification}` : ''}</p>
            <p className="doc-line">
              {doctor.experience ? `${doctor.experience} yrs experience` : ''}
              {doctor.location ? ` · ${doctor.location}` : ''}
              {doctor.fees ? ` · ₹${doctor.fees} / visit` : ''}
            </p>
            {(doctor as any).languages && <p className="doc-line">Speaks: {(doctor as any).languages}{(doctor as any).availableDays ? ` · Available ${(doctor as any).availableDays}` : ''}</p>}
            {(doctor as any).about && <p className="doc-line">{(doctor as any).about}</p>}
          </div>
        </div>

        <div className="booking-form">
          <label className="field">
            <span>Appointment date</span>
            <input
              type="date"
              value={date}
              min={todayYmd}
              max={maxYmd}
              onChange={(e) => {
                const selectedDate = e.target.value
                setTime('')
                if (!selectedDate) {
                  setDate('')
                  return
                }
                if (selectedDate < todayYmd) {
                  alert("You cannot book a past date. Please choose today or a later date.")
                  setDate('')
                  return
                }
                const [y, m, d] = selectedDate.split('-').map(Number)
                if (new Date(y, m - 1, d).getDay() === 0) {
                  alert("Sunday is not available for booking")
                  setDate('')
                  return
                }
                setDate(selectedDate)
              }}
            />
          </label>

          {date && (
            <div className="slot-picker">
              <span className="slot-title">Choose a time slot</span>
              {slotsLoading && <p className="muted">Checking availability…</p>}
              {slotsError && <p className="error">{slotsError}</p>}
              <div className="slot-grid">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={!slot.available}
                    className={`slot-chip ${time === slot.time ? 'selected' : ''}`}
                    onClick={() => setTime(slot.time)}
                    title={slot.available ? 'Available' : slot.reason || 'Unavailable'}
                  >
                    {slot.time.split(' - ')[0]}
                    {!slot.available && <small>{slot.reason}</small>}
                  </button>
                ))}
              </div>
              {!slotsLoading && !slotsError && slots.length > 0 && slots.every((x) => !x.available) && (
                <p className="muted">No slots left on this day. Please pick another date.</p>
              )}
            </div>
          )}

          {time && (
            <>
              <h3 className="form-section-title">Patient details</h3>

              <label className={`field ${showErr('patientName') ? 'invalid' : ''}`}>
                <span>Patient name *</span>
                <input
                  type="text"
                  placeholder="Full name (letters only)"
                  value={patientName}
                  maxLength={50}
                  autoComplete="name"
                  onChange={(e) => setPatientName(e.target.value.replace(/[^\p{L} .'-]/gu, '').replace(/\s{2,}/g, ' '))}
                  onBlur={() => touch('patientName')}
                />
                {showErr('patientName') && <small className="field-error">{showErr('patientName')}</small>}
              </label>

              <div className="form-grid-2">
                <label className={`field ${showErr('age') ? 'invalid' : ''}`}>
                  <span>Age *</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 32"
                    value={age}
                    maxLength={2}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    onBlur={() => touch('age')}
                  />
                  {showErr('age') ? <small className="field-error">{showErr('age')}</small> : <small className="field-hint">1 to 99 (2 digits max)</small>}
                </label>

                <label className={`field ${showErr('contact') ? 'invalid' : ''}`}>
                  <span>Mobile number *</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit number"
                    value={contact}
                    maxLength={10}
                    autoComplete="tel"
                    onChange={(e) => setContact(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onBlur={() => touch('contact')}
                  />
                  {showErr('contact') ? <small className="field-error">{showErr('contact')}</small> : <small className="field-hint">{contact.length}/10 digits</small>}
                </label>
              </div>

              <label className={`field ${showErr('problem') ? 'invalid' : ''}`}>
                <span>Reason for visit *</span>
                <textarea
                  placeholder="Describe your symptoms or reason for the visit"
                  value={problem}
                  maxLength={500}
                  onChange={(e) => setProblem(e.target.value)}
                  onBlur={() => touch('problem')}
                />
                {showErr('problem') ? <small className="field-error">{showErr('problem')}</small> : <small className="field-hint">{problem.length}/500</small>}
              </label>

              <h3 style={{ marginTop: "15px" }}>Payment</h3>

              <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                Consultation Fee: ₹{consultationFee}
              </p>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: "100%", height: "42px", margin: "6px 0" }}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Debit / Credit Card</option>
              </select>

              {/* ✅ Card Form */}
              {paymentMethod === "Card" && (
                <div style={{ marginTop: "10px" }}>
                  <h4>Enter Debit/Credit Card Details</h4>

                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Expiry (MM/YY)"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              )}

              {/* ✅ UPI Form */}
              {paymentMethod === "UPI" && (
                <div style={{ marginTop: "10px" }}>
                  <h4>UPI Payment</h4>

                  <input
                    type="text"
                    placeholder="Enter UPI ID (example@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />

                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <p style={{ fontWeight: "bold" }}>Scan QR to Pay</p>

                    {/* 🔥 Add QR Image in public folder */}
                    <img
                      src="/image.png"
                      alt="UPI QR"
                      style={{
                        width: "180px",
                        height: "180px",
                        border: "1px solid gray",
                        borderRadius: "10px",
                      }}
                    />

                    <p style={{ fontSize: "13px", marginTop: "8px" }}>
                      Amount: ₹{consultationFee}
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter Transaction ID"
                    value={upiTransactionId}
                    onChange={(e) => setUpiTransactionId(e.target.value)}
                    style={{ marginTop: "10px" }}
                  />

                  <button
                    type="button"
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "10px",
                      background: "green",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                    onClick={() => {
                      if (!upiId || !upiId.includes("@")) {
                        alert("Enter valid UPI ID!")
                        return
                      }

                      if (!upiTransactionId) {
                        alert("Enter Transaction ID!")
                        return
                      }

                      alert("UPI Payment Successful!")
                      setUpiPaid(true)
                    }}
                  >
                    Pay Now
                  </button>

                  {upiPaid && (
                    <p style={{ color: "green", fontWeight: "bold", marginTop: "8px" }}>
                      Payment Verified Successfully ✅
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <button onClick={handleBook}>Confirm Booking & Pay</button>
        </div>

        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  )
}