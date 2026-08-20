import { useEffect, useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const initialForm = { patientName: '', email: '', phone: '', bloodGroup: '', age: '', doctorId: '', date: '', timeSlot: '', status: 'pending', reason: '' };

async function readJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Backend API is unavailable. Start the backend on port 5052.');
  }
  return response.json();
}

export default function BookingPage() {
  const [formData, setFormData] = useState(initialForm);
  const [doctors, setDoctors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/v1/doctors`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load doctors.');
        return response.json();
      })
      .then((result) => setDoctors(result.data || []))
      .catch((requestError) => setError(requestError.message));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const patientResponse = await fetch(`${API_URL}/api/v1/patients`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.patientName, email: formData.email, phone: formData.phone, bloodGroup: formData.bloodGroup || undefined, age: formData.age ? Number(formData.age) : undefined }),
      });
      const patientResult = await readJson(patientResponse);
      if (!patientResponse.ok) throw new Error(patientResult.message || 'Unable to save patient.');
      const appointmentResponse = await fetch(`${API_URL}/api/v1/appointments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patientResult.data._id || patientResult.data.id, doctorId: formData.doctorId, date: formData.date, timeSlot: formData.timeSlot, status: formData.status, reason: formData.reason }),
      });
      const appointmentResult = await readJson(appointmentResponse);
      if (!appointmentResponse.ok) throw new Error(appointmentResult.message || 'Unable to save appointment.');
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  const selectedDoctor = doctors.find((doctor) => (doctor._id || doctor.id) === formData.doctorId);

  return (
    <section className="booking-layout">
      <div className="section-heading">
        <p className="eyebrow">A calmer way to plan care</p>
        <h1>Book an appointment</h1>
        <p>Choose a time that works for you.</p>
      </div>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label>Patient name<input name="patientName" value={formData.patientName} onChange={handleChange} required /></label>
        <label>Patient email<input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
        <label>Phone<input name="phone" value={formData.phone} onChange={handleChange} /></label>
        <label>Blood group<select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
          <option value="">Select blood group</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
        </select></label>
        <label>Age<input type="number" min="0" name="age" value={formData.age} onChange={handleChange} /></label>
        <label>Doctor name<select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>{doctor.name}</option>)}
        </select></label>
        <label>Date<input type="date" name="date" value={formData.date} onChange={handleChange} required /></label>
        <label>Time slot<select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
          <option value="">Select a slot</option><option>09:00 AM</option><option>10:30 AM</option><option>02:00 PM</option><option>04:30 PM</option>
        </select></label>
        <label>Status<select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
        </select></label>
        <label>Reason<textarea name="reason" maxLength="300" value={formData.reason} onChange={handleChange} /></label>
        <button type="submit" disabled={saving}>{saving ? 'Saving appointment...' : 'Request appointment'}</button>
      </form>
      {error && <p className="message error-message">{error}</p>}
      <p className="live-summary">{formData.patientName ? `Booking for ${formData.patientName}` : 'Your booking details will appear here.'}</p>
      <AppointmentCard
        patientName={formData.patientName || 'Patient name'}
        doctorName={selectedDoctor?.name || 'Doctor name'}
        date={formData.date || 'Date not selected'}
        timeSlot={formData.timeSlot || 'Time slot not selected'}
        status={formData.status}
      />
      {submitted && <p className="success-message">Appointment saved for {selectedDoctor?.name} on {formData.date}.</p>}
    </section>
  );
}
