'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, User, Calendar, IndianRupee, TrendingUp, Activity, UserPlus, FileText, Settings, Bell, LogOut, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Star, Heart, Shield, Award, AlertCircle } from "lucide-react"

type Doctor = {
  id: number
  name: string
  specialization: string
  experience: string
  fees: string
  location: string
  image: string
  rating?: number
  status?: 'active' | 'inactive'
}

type Appointment = {
  id: number
  doctor: string
  date: string
  time: string
  patientName: string
  contact: string
  email: string
  paymentMethod?: string
  paymentStatus?: string
  status?: 'pending' | 'approved' | 'scheduled' | 'completed' | 'cancelled' | 'rejected' | 'no-show'
  type?: 'in-person' | 'virtual'
}

interface KPICard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'appointments' | 'analytics'>('overview')
  const [searchTerm, setSearchTerm] = useState("")
  const [notifications, setNotifications] = useState(5)

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<any>(null)
  const [accounts, setAccounts] = useState<{ doctorId: number; doctorName: string; email: string | null; hasLogin: boolean }[]>([])

  const [name, setName] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [experience, setExperience] = useState("")
  const [fees, setFees] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null")

    if (!user || user.role !== "admin") {
      alert("Access Denied! Admin only.")
      router.push("/login")
      return
    }

    fetchDoctors()
    fetchAppointments()
    fetchStats()
    fetchAccounts()
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-accounts`, { headers: getAuthHeaders() })
      if (res.ok) setAccounts(await res.json())
    } catch (error) {
      console.error("Failed to fetch doctor accounts:", error)
    }
  }

  const setDoctorLogin = async (doctorId: number, doctorName: string, currentEmail: string | null) => {
    const email = window.prompt(`Login email for ${doctorName}:`, currentEmail || "")
    if (!email) return
    const password = window.prompt(`Password for ${doctorName} (min 6 characters):`)
    if (!password) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/doctors/${doctorId}/account`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        alert(data?.message || "Could not save the doctor login.")
        return
      }
      alert(`Doctor login saved.\n\nEmail: ${data.email}\nThe doctor signs in on the Login page using the "Doctor" tab.`)
      fetchAccounts()
    } catch {
      alert("Failed to save. Please make sure the backend is running.")
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, { headers: getAuthHeaders() })
      if (res.ok) setStats(await res.json())
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    const note = status === 'rejected' ? (window.prompt("Reason / note for the patient (optional):") ?? "") : ""
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        alert(data?.message || "Could not update the appointment.")
        return
      }
      fetchAppointments()
      fetchStats()
    } catch (error) {
      alert("Failed to update. Please make sure Spring Boot backend is running.")
    }
  }

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        headers: getAuthHeaders()
      })
      const data = await res.json()
      setDoctors(data.map((doc: Doctor) => ({
        ...doc,
        rating: doc.rating || (4.5 + Math.random() * 0.5),
        status: doc.status || 'active'
      })))
    } catch (error) {
      console.error("Failed to fetch doctors:", error)
    }
  }

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        headers: getAuthHeaders()
      })
      const data = await res.json()
      setAppointments(data.map((apt: Appointment) => ({
        ...apt,
        status: apt.status || 'scheduled',
        type: apt.type || 'in-person',
        paymentStatus: apt.paymentStatus || 'paid'
      })))
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    }
  }

  const addDoctor = async () => {
    if (!name || !specialization || !experience || !fees || !location || !image) {
      alert("Fill all doctor details!")
      return
    }

    const newDoctor = {
      name,
      specialization,
      experience,
      fees: parseFloat(fees) || 500,
      location,
      image,
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newDoctor),
      })

      if (!res.ok) {
        alert("Failed to add doctor.")
        return
      }

      alert("Doctor Added Successfully!")
      fetchDoctors()
      
      setName("")
      setSpecialization("")
      setExperience("")
      setFees("")
      setLocation("")
      setImage("")
    } catch (error) {
      alert("Failed to add doctor. Please make sure Spring Boot backend is running.")
    }
  }

  const deleteDoctor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      })
      alert("Doctor Deleted Successfully!")
      fetchDoctors()
    } catch (error) {
      alert("Failed to delete doctor. Please make sure Spring Boot backend is running.")
    }
  }

  const deleteAppointment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      })
      alert("Appointment Deleted Successfully!")
      fetchAppointments()
    } catch (error) {
      alert("Failed to delete appointment. Please make sure Spring Boot backend is running.")
    }
  }

  const kpis: KPICard[] = [
    { title: 'Total Doctors', value: String(stats?.totalDoctors ?? doctors.length), change: '', trend: 'neutral', icon: Users },
    { title: 'Total Appointments', value: String(stats?.totalAppointments ?? appointments.length), change: `${stats?.pendingAppointments ?? 0} pending`, trend: 'neutral', icon: Calendar },
    { title: 'Revenue (paid)', value: `₹${Math.round(stats?.revenue ?? 0).toLocaleString('en-IN')}`, change: '', trend: 'neutral', icon: IndianRupee },
    { title: 'Registered Patients', value: String(stats?.totalPatients ?? 0), change: '', trend: 'neutral', icon: Activity }
  ]

  const recentAppointments = appointments.slice(0, 5)
  const upcomingAppointments = appointments.filter(apt => (apt.status === 'scheduled' || apt.status === 'approved' || apt.status === 'pending')).slice(0, 3)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'var(--success)'
      case 'cancelled': return 'var(--error)'
      case 'scheduled': case 'approved': return 'var(--primary-blue)'
      case 'pending': return 'var(--warning)'
      case 'rejected': return 'var(--error)'
      case 'no-show': return 'var(--warning)'
      default: return 'var(--neutral-500)'
    }
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Manage your healthcare platform efficiently</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search doctors, appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="notification-bell">
              <Bell size={20} />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </div>
            <button onClick={() => router.push("/login")} className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <div className="nav-tabs">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'doctors', label: 'Doctors', icon: Users },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.id as any); if (tab.id === 'doctors') fetchAccounts() }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* KPI Cards */}
            <div className="kpi-grid">
              {kpis.map((kpi, index) => (
                <div key={index} className="kpi-card">
                  <div className="kpi-header">
                    <kpi.icon className="kpi-icon" />
                    <span className={`kpi-trend ${kpi.trend}`}>
                      {kpi.change}
                    </span>
                  </div>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className="kpi-title">{kpi.title}</div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-content">
                  <h3>Today's Appointments</h3>
                  <p>12 scheduled, 2 completed</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <IndianRupee size={24} />
                </div>
                <div className="stat-content">
                  <h3>Today's Revenue</h3>
                  <p>$2,340 from 8 payments</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>New Patients</h3>
                  <p>5 registered this week</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {recentAppointments.map(apt => (
                  <div key={apt.id} className="activity-item">
                    <div className="activity-icon">
                      <Calendar size={20} />
                    </div>
                    <div className="activity-content">
                      <h4>{apt.patientName} - {apt.doctor}</h4>
                      <p>{apt.date} at {apt.time}</p>
                    </div>
                    <div className="activity-status" style={{ color: getStatusColor(apt.status) }}>
                      {apt.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="doctors-content">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 6px' }}>Doctor logins</h3>
              <p style={{ margin: '0 0 14px', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                Give each doctor a login so they can accept appointments in the Doctor Panel.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--ink-soft)' }}>
                      <th style={{ padding: '8px 10px' }}>Doctor</th>
                      <th style={{ padding: '8px 10px' }}>Login email</th>
                      <th style={{ padding: '8px 10px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr key={acc.doctorId} style={{ borderTop: '1px solid var(--line)' }}>
                        <td style={{ padding: '10px' }}>{acc.doctorName}</td>
                        <td style={{ padding: '10px', color: acc.hasLogin ? 'inherit' : 'var(--ink-soft)' }}>{acc.email || 'No login yet'}</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setDoctorLogin(acc.doctorId, acc.doctorName, acc.email)}>
                            {acc.hasLogin ? 'Change login' : 'Create login'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {accounts.length === 0 && (
                      <tr><td colSpan={3} style={{ padding: 12, color: 'var(--ink-soft)' }}>No doctors found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="content-header">
              <h2>Doctor Management</h2>
              <button className="add-btn" onClick={() => document.getElementById('add-doctor-form')?.scrollIntoView()}>
                <UserPlus size={20} />
                Add Doctor
              </button>
            </div>

            {/* Add Doctor Form */}
            <div id="add-doctor-form" className="add-doctor-form">
              <h3>Add New Doctor</h3>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Doctor Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Experience (Years)"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Consultation Fees"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Image URL (ex: /img1.jpg)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              <button onClick={addDoctor} className="submit-btn">
                <UserPlus size={20} />
                Add Doctor
              </button>
            </div>

            {/* Doctors List */}
            <div className="doctors-list">
              {doctors.length === 0 ? (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>No Doctors Found</h3>
                  <p>Add your first doctor to get started</p>
                </div>
              ) : (
                <div className="doctors-grid">
                  {doctors.map((doc) => (
                    <div key={doc.id} className="doctor-card">
                      <div className="doctor-header">
                        <div className="doctor-avatar">
                          <img src={doc.image} alt={doc.name} />
                        </div>
                        <div className="doctor-info">
                          <h3>{doc.name}</h3>
                          <p>{doc.specialization}</p>
                          <div className="doctor-rating">
                            <Star size={16} className="star" />
                            <span>{doc.rating?.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="doctor-status">
                          <span className={`status-badge ${doc.status}`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>
                      <div className="doctor-details">
                        <div className="detail-item">
                          <span>Experience:</span>
                          <span>{doc.experience} years</span>
                        </div>
                        <div className="detail-item">
                          <span>Fees:</span>
                          <span>${doc.fees}</span>
                        </div>
                        <div className="detail-item">
                          <span>Location:</span>
                          <span>{doc.location}</span>
                        </div>
                      </div>
                      <div className="doctor-actions">
                        <button className="action-btn view">
                          <Eye size={16} />
                          View
                        </button>
                        <button className="action-btn edit">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button onClick={() => deleteDoctor(doc.id)} className="action-btn delete">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="appointments-content">
            <div className="content-header">
              <h2>Appointment Management</h2>
              <div className="header-actions">
                <button className="filter-btn">
                  <Filter size={20} />
                  Filter
                </button>
                <button className="export-btn">
                  <Download size={20} />
                  Export
                </button>
              </div>
            </div>

            {/* Appointment Stats */}
            <div className="appointment-stats">
              <div className="stat-item">
                <div className="stat-number">{appointments.filter(apt => (apt.status === 'scheduled' || apt.status === 'approved' || apt.status === 'pending')).length}</div>
                <div className="stat-label">Scheduled</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{appointments.filter(apt => apt.status === 'completed').length}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{appointments.filter(apt => apt.status === 'cancelled').length}</div>
                <div className="stat-label">Cancelled</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{appointments.filter(apt => apt.paymentStatus === 'paid').length}</div>
                <div className="stat-label">Paid</div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="appointments-list">
              {appointments.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                  <h3>No Appointments Found</h3>
                  <p>No appointments have been scheduled yet</p>
                </div>
              ) : (
                <div className="appointments-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <div className="patient-info">
                              <div className="patient-avatar">
                                <User size={20} />
                              </div>
                              <div>
                                <div className="patient-name">{app.patientName}</div>
                                <div className="patient-contact">{app.contact}</div>
                              </div>
                            </div>
                          </td>
                          <td>{app.doctor}</td>
                          <td>
                            <div className="datetime">
                              <div>{app.date}</div>
                              <div>{app.time}</div>
                            </div>
                          </td>
                          <td>
                            <span className="type-badge">
                              {app.type === 'virtual' ? 'Virtual' : 'In-Person'}
                            </span>
                          </td>
                          <td>
                            <span className="status-badge" style={{ color: getStatusColor(app.status) }}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <span className={`payment-badge ${app.paymentStatus}`}>
                              {app.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              {app.status === 'pending' && (
                                <>
                                  <button onClick={() => updateStatus(app.id, 'approved')} className="action-btn view" title="Approve">✓</button>
                                  <button onClick={() => updateStatus(app.id, 'rejected')} className="action-btn delete" title="Reject">✕</button>
                                </>
                              )}
                              {(app.status === 'approved' || app.status === 'scheduled') && (
                                <button onClick={() => updateStatus(app.id, 'completed')} className="action-btn edit" title="Mark completed">✔✔</button>
                              )}
                              <button onClick={() => deleteAppointment(app.id)} className="action-btn delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <h2>Analytics & Reports</h2>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Revenue Overview</h3>
                <div className="chart-placeholder">
                  <TrendingUp size={48} />
                  <p>Revenue chart would be displayed here</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Appointment Trends</h3>
                <div className="chart-placeholder">
                  <Activity size={48} />
                  <p>Appointment trends chart would be displayed here</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Doctor Performance</h3>
                <div className="chart-placeholder">
                  <Award size={48} />
                  <p>Doctor performance metrics would be displayed here</p>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Patient Demographics</h3>
                <div className="chart-placeholder">
                  <Users size={48} />
                  <p>Patient demographics chart would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: var(--neutral-50);
        }

        .admin-header {
          background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%);
          color: white;
          padding: 2rem;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .header-left h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .header-left p {
          opacity: 0.9;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          backdrop-filter: blur(10px);
        }

        .search-bar input {
          background: none;
          border: none;
          color: white;
          outline: none;
          margin-left: 0.5rem;
          width: 250px;
        }

        .search-bar input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .notification-bell {
          position: relative;
          cursor: pointer;
        }

        .notification-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--secondary-orange);
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .admin-nav {
          background: white;
          border-bottom: 1px solid var(--neutral-200);
          padding: 0 2rem;
        }

        .nav-tabs {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 1rem;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--neutral-600);
          font-weight: 500;
        }

        .nav-tab:hover {
          color: var(--primary-blue);
          background: var(--neutral-50);
        }

        .nav-tab.active {
          color: var(--primary-blue);
          border-bottom-color: var(--primary-blue);
        }

        .admin-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kpi-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .kpi-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-blue);
        }

        .kpi-trend {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .kpi-trend.up {
          background: var(--success);
          color: white;
        }

        .kpi-trend.down {
          background: var(--error);
          color: white;
        }

        .kpi-trend.neutral {
          background: var(--neutral-200);
          color: var(--neutral-600);
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--neutral-800);
          margin-bottom: 0.5rem;
        }

        .kpi-title {
          color: var(--neutral-600);
          font-size: 0.9rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: var(--primary-blue);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: var(--neutral-800);
        }

        .stat-content p {
          color: var(--neutral-600);
          font-size: 0.9rem;
        }

        .activity-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
        }

        .activity-section h2 {
          margin-bottom: 1.5rem;
          color: var(--neutral-800);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--neutral-50);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: var(--neutral-100);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: var(--primary-blue);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content h4 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          color: var(--neutral-800);
        }

        .activity-content p {
          color: var(--neutral-600);
          font-size: 0.9rem;
        }

        .activity-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .content-header h2 {
          color: var(--neutral-800);
        }

        .add-btn, .filter-btn, .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-btn:hover, .filter-btn:hover, .export-btn:hover {
          background: var(--primary-blue-dark);
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .add-doctor-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
          margin-bottom: 2rem;
        }

        .add-doctor-form h3 {
          margin-bottom: 1.5rem;
          color: var(--neutral-800);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-grid input {
          padding: 0.75rem 1rem;
          border: 1px solid var(--neutral-300);
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-grid input:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary-green);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: var(--primary-green-dark);
        }

        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .doctor-card {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .doctor-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .doctor-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--neutral-100);
        }

        .doctor-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
        }

        .doctor-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .doctor-info {
          flex: 1;
        }

        .doctor-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: var(--neutral-800);
        }

        .doctor-info p {
          color: var(--neutral-600);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .doctor-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .doctor-rating .star {
          color: var(--secondary-orange);
          fill: var(--secondary-orange);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.active {
          background: var(--success);
          color: white;
        }

        .status-badge.inactive {
          background: var(--neutral-300);
          color: var(--neutral-700);
        }

        .doctor-details {
          padding: 1rem 1.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .detail-item span:first-child {
          color: var(--neutral-600);
        }

        .detail-item span:last-child {
          color: var(--neutral-800);
          font-weight: 500;
        }

        .doctor-actions {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--neutral-100);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .action-btn.view {
          background: var(--primary-blue);
          color: white;
        }

        .action-btn.edit {
          background: var(--warning);
          color: white;
        }

        .action-btn.delete {
          background: var(--error);
          color: white;
        }

        .appointment-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-blue);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--neutral-600);
          font-size: 0.9rem;
        }

        .appointments-table {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
          overflow: hidden;
        }

        .appointments-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .appointments-table th {
          background: var(--neutral-50);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--neutral-700);
          border-bottom: 1px solid var(--neutral-200);
        }

        .appointments-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--neutral-100);
        }

        .patient-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .patient-avatar {
          width: 40px;
          height: 40px;
          background: var(--primary-blue);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .patient-name {
          font-weight: 500;
          color: var(--neutral-800);
        }

        .patient-contact {
          font-size: 0.85rem;
          color: var(--neutral-600);
        }

        .datetime div:first-child {
          font-weight: 500;
          color: var(--neutral-800);
        }

        .datetime div:last-child {
          font-size: 0.85rem;
          color: var(--neutral-600);
        }

        .type-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--neutral-100);
          color: var(--neutral-700);
        }

        .payment-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .payment-badge.paid {
          background: var(--success);
          color: white;
        }

        .payment-badge.pending {
          background: var(--warning);
          color: white;
        }

        .payment-badge.refunded {
          background: var(--neutral-300);
          color: var(--neutral-700);
        }

        .table-actions {
          display: flex;
          gap: 0.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--neutral-500);
        }

        .empty-state h3 {
          color: var(--neutral-700);
          margin: 1rem 0 0.5rem;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .analytics-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--neutral-200);
        }

        .analytics-card h3 {
          margin-bottom: 1.5rem;
          color: var(--neutral-800);
        }

        .chart-placeholder {
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--neutral-50);
          border-radius: 8px;
          color: var(--neutral-400);
        }

        .chart-placeholder p {
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .header-right {
            justify-content: space-between;
          }

          .search-bar input {
            width: 150px;
          }

          .nav-tabs {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .kpi-grid,
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .doctors-grid,
          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .appointment-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .appointments-table {
            overflow-x: auto;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}