const statusClasses = {
  confirmed: 'status-confirmed',
  pending: 'status-pending',
  cancelled: 'status-cancelled',
};

export default function AppointmentCard({ patientName, doctorName, date, timeSlot, status, onClick }) {
  function handleKeyDown(event) {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <article className={`appointment-card${onClick ? ' appointment-card-clickable' : ''}`} onClick={onClick} onKeyDown={handleKeyDown} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
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
