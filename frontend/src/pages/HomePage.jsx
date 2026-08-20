import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const sampleAppointment = {
  patientName: 'Aarav Sharma',
  doctorName: 'Dr. Maya Patel',
  date: '2026-08-24',
  timeSlot: '10:30 AM',
  status: 'confirmed',
};

export default function HomePage() {
  const [appointment, setAppointment] = useState(sampleAppointment);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/appointments`)
      .then((response) => response.json())
      .then((result) => {
        const saved = result.data?.[0];
        if (saved) {
          setAppointment({
            patientName: saved.patientId?.name || saved.patientName || 'Patient',
            doctorName: saved.doctorId?.name || saved.doctorName || 'Doctor',
            date: saved.date,
            timeSlot: saved.timeSlot,
            status: saved.status,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Private care, thoughtfully arranged</p>
        <h1>Your health deserves a clear next step.</h1>
        <p className="hero-text">Find the right specialist and book a visit with MedCare Plus.</p>
      </div>
      <div className="home-appointment-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Your care, in view</p>
            <h2>Next visit</h2>
          </div>
          <span className="calendar-mark">{appointment.date.slice(-2)}</span>
        </div>
        <AppointmentCard {...appointment} />
        <Link className="home-action" to="/booking">Schedule another visit <span aria-hidden="true">-&gt;</span></Link>
      </div>
    </section>
  );
}
