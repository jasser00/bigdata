import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>🔧 PredictMaint</h1>
        <p>Machine Maintenance AI</p>
      </div>
      <nav>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📊</span>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/predict" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">🎯</span>
              New Prediction
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">📜</span>
              History
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/machines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">⚙️</span>
              Machines
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
