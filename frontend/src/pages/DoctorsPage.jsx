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
    <section>
      <div className="section-heading">
        <p className="eyebrow">Our clinical team</p>
        <h1>Meet the doctors</h1>
      </div>
      {loading && <p className="message">Loading doctors...</p>}
      {error && <p className="message error-message">{error}</p>}
      {!loading && !error && (
        data.length ? (
          <div className="doctor-grid">
            {data.map((doctor) => (
              <article className="doctor-card" key={doctor._id || doctor.id || doctor.email}>
                <div className="doctor-avatar">{doctor.name.charAt(0)}</div>
                <h2>{doctor.name}</h2>
                <p>{doctor.specialisation}</p>
                <span className={doctor.available ? 'availability available' : 'availability unavailable'}>
                  {doctor.available ? 'Available' : 'Unavailable'}
                </span>
              </article>
            ))}
          </div>
        ) : <p className="message">No doctors found.</p>
      )}
    </section>
  );
}
