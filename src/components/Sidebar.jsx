import "../css/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">LOGO</div>

      {/* Search Bar */}
      <div className="search-box">
        <img src="/icons/search.svg" alt="Account" width={20} height={20} />
        <input type="text" placeholder="Search" />
      </div>

      {/* Recruitment  */}

      <div className="menu-title">
        <h5>Recruitment</h5>
        <ul>
          <li>
            <a href="/candidates" className="menu-item">
              <img
                src="/icons/candidates.svg"
                alt="Account"
                width={20}
                height={20}
              />
              <span>Candidates</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Organization */}

      <div className="menu-title">
        <h5>Organization</h5>
        <ul>
          <li>
            <a href="/employees" className="menu-item">
              <img
                src="/icons/employees.svg"
                alt="Account"
                width={20}
                height={20}
                className="sidebar-menu"
              />
              <span>Employees</span>
            </a>
          </li>
          <li>
            <a href="/attendance" className="menu-item">
              <img
                src="/icons/attendance.svg"
                alt="Account"
                width={20}
                height={20}
                className="sidebar-menu"
              />
              <span>Attendance</span>
            </a>
          </li>
          <li>
            <a href="/leaves" className="menu-item">
              <img
                src="/icons/leaves.svg"
                alt="Account"
                width={20}
                height={20}
                className="sidebar-menu"
              />
              <span>Leaves</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Others */}

      <div className="menu-title">
        <h5>Others</h5>
        <ul>
          <li>
            <a href="/employees" className="menu-item">
              <img
                src="/icons/logout.svg"
                alt="Account"
                width={20}
                height={20}
                className="sidebar-menu"
              />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
