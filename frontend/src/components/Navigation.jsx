import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/">MedCare <span>Plus</span></NavLink>
      <nav aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/doctors">Doctors</NavLink>
        <NavLink to="/booking">Book appointment</NavLink>
      </nav>
    </header>
  );
}
