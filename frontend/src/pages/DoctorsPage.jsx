import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DoctorsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadDoctors() {
      try {
        const response = await fetch(`${API_URL}/api/v1/doctors`, { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to load doctors.');
        const result = await response.json();
        setData(result.data || []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadDoctors();

    return () => controller.abort();
  }, []);

  return (
    <section className="doctors-page">
      <div className="doctors-intro">
        <div className="section-heading">
          <p className="eyebrow">MedCare Plus / clinical directory</p>
          <h1>Care, with the right specialist.</h1>
          <p>Our consultants bring calm expertise to every appointment, from first questions to follow-up care.</p>
        </div>
        <div className="directory-note"><span className="directory-dot" /> <strong>{data.length || '03'}</strong> specialist profiles<br /><small>Updated from the live hospital directory</small></div>
      </div>
      {loading && <p className="message">Loading doctors...</p>}
      {error && <p className="message error-message">{error}</p>}
      {!loading && !error && (
        data.length ? (
          <div className="doctor-grid">
            {data.map((doctor, index) => (
              <article className="doctor-card" key={doctor._id || doctor.id || doctor.email}>
                <div className="doctor-card-top"><span className="doctor-number">0{index + 1}</span><span className={doctor.available ? 'availability available' : 'availability unavailable'}>{doctor.available ? 'Available today' : 'Currently away'}</span></div>
                <div className="doctor-avatar">{doctor.name.charAt(0)}</div>
                <h2>{doctor.name}</h2>
                <p className="doctor-speciality">{doctor.specialisation}</p>
                <div className="doctor-card-footer"><span>Consultation</span><strong>{doctor.available ? 'Book a visit' : 'View profile'}</strong></div>
              </article>
            ))}
          </div>
        ) : <p className="message">No doctors found.</p>
      )}
    </section>
  );
}
