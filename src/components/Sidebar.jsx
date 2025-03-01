import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
      <img src="/icons/logo.svg" alt="Search" width={20} height={20} />
      <div className="">LOGO</div>
      </div>

      {/* Search Bar */}
      <div className="search-box">
        <img src="/icons/search.svg" alt="Search" width={20} height={20} />
        <input type="text" placeholder="Search" />
      </div>

      {/* Recruitment */}
      <div className="menu-title">
        <h5>Recruitment</h5>
        <ul>
          <li>
            <NavLink to="/candidates" className="menu-item" activeClassName="active">
              <img src="/icons/candidates.svg" alt="Candidates" width={20} height={20} />
              <span>Candidates</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Organization */}
      <div className="menu-title">
        <h5>Organization</h5>
        <ul>
          <li>
            <NavLink to="/employees" className="menu-item" activeClassName="active">
              <img src="/icons/employees.svg" alt="Employees" width={20} height={20} />
              <span>Employees</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/attendance" className="menu-item" activeClassName="active">
              <img src="/icons/attendance.svg" alt="Attendance" width={20} height={20} />
              <span>Attendance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaves" className="menu-item" activeClassName="active">
              <img src="/icons/leaves.svg" alt="Leaves" width={20} height={20} />
              <span>Leaves</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Others */}
      <div className="menu-title">
        <h5>Others</h5>
        <ul>
          <li>
            <NavLink to="/logout" className="menu-item" activeClassName="active">
              <img src="/icons/logout.svg" alt="Logout" width={20} height={20} />
              <span>Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
