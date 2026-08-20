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
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/appointments`)
      .then((response) => response.json())
      .then((result) => {
        const saved = result.data?.[0];
        if (saved) {
          setAppointment({
            appointmentId: saved._id || saved.id,
            patientName: saved.patientId?.name || saved.patientName || 'Patient',
            patientEmail: saved.patientId?.email || saved.patientEmail,
            patientPhone: saved.patientId?.phone || saved.patientPhone,
            doctorName: saved.doctorId?.name || saved.doctorName || 'Doctor',
            doctorId: saved.doctorId?._id || saved.doctorId,
            date: saved.date,
            timeSlot: saved.timeSlot,
            status: saved.status,
            reason: saved.reason,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Patient portal / Tuesday, 20 August 2026</p>
        <h1>Your health deserves a clear next step.</h1>
        <p className="hero-text">Here is your care at a glance. Your next appointment and trusted clinical team are one step away.</p>
        <div className="hero-signature">
          <span className="signature-line" />
          <span>One place for your next step in care</span>
        </div>
        <div className="home-facts" aria-label="MedCare Plus highlights">
          <div><strong>24/7</strong><span>support line</span></div>
          <div><strong>03</strong><span>specialists available</span></div>
          <div><strong>01</strong><span>upcoming visit</span></div>
        </div>
      </div>
      <div className="home-appointment-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Your care, in view</p>
            <h2>Next visit</h2>
          </div>
          <span className="calendar-mark">{appointment.date.slice(-2)}</span>
        </div>
        <AppointmentCard {...appointment} onClick={() => setSelectedAppointment(appointment)} />
        <Link className="home-action" to="/booking">Schedule another visit <span aria-hidden="true">-&gt;</span></Link>
      </div>
      <div className="dashboard-shortcuts">
        <Link to="/doctors"><span className="shortcut-icon">+</span><span><strong>Find a specialist</strong><small>Browse doctors and availability</small></span><b aria-hidden="true">-&gt;</b></Link>
        <Link to="/booking"><span className="shortcut-icon">+</span><span><strong>Request an appointment</strong><small>Choose a doctor and time slot</small></span><b aria-hidden="true">-&gt;</b></Link>
      </div>
      {selectedAppointment && (
        <div className="appointment-modal-backdrop" role="presentation" onClick={() => setSelectedAppointment(null)}>
          <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-detail-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close appointment details" onClick={() => setSelectedAppointment(null)}>x</button>
            <p className="eyebrow">Appointment details</p>
            <h2 id="appointment-detail-title">{selectedAppointment.patientName}</h2>
            <p className="appointment-modal-subtitle">with {selectedAppointment.doctorName}</p>
            <dl className="appointment-details-list">
              <div><dt>Date</dt><dd>{selectedAppointment.date}</dd></div>
              <div><dt>Time slot</dt><dd>{selectedAppointment.timeSlot}</dd></div>
              <div><dt>Status</dt><dd><strong className={`status-${selectedAppointment.status}`}>{selectedAppointment.status}</strong></dd></div>
              <div><dt>Reason</dt><dd>{selectedAppointment.reason || 'No reason provided'}</dd></div>
              {selectedAppointment.patientEmail && <div><dt>Patient email</dt><dd>{selectedAppointment.patientEmail}</dd></div>}
              {selectedAppointment.patientPhone && <div><dt>Patient phone</dt><dd>{selectedAppointment.patientPhone}</dd></div>}
              {selectedAppointment.appointmentId && <div><dt>Appointment ID</dt><dd>{selectedAppointment.appointmentId}</dd></div>}
              {selectedAppointment.doctorId && <div><dt>Doctor ID</dt><dd>{selectedAppointment.doctorId}</dd></div>}
            </dl>
          </section>
        </div>
      )}
    </section>
  );
}
