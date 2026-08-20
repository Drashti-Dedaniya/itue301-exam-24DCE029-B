const statusClasses = {
  confirmed: 'status-confirmed',
  pending: 'status-pending',
  cancelled: 'status-cancelled',
};

export default function AppointmentCard({ patientName, doctorName, date, timeSlot, status }) {
  return (
    <article className="appointment-card">
      <div>
        <p className="eyebrow">Appointment</p>
        <h2>{patientName}</h2>
        <p>with {doctorName}</p>
      </div>
      <div className="appointment-details">
        <span>{date}</span>
        <span>{timeSlot}</span>
        <strong className={statusClasses[status] || 'status-pending'}>{status}</strong>
      </div>
    </article>
  );
}
