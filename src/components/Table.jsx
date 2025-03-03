import React, { useState } from "react";
import "../css/ReusableTable.css";

const Table = ({
  title,
  columns,
  data,
  onRowAction,
  onStatusChange,
  filterOptions = [],
  statusOptions = [],
  showAddButton = false,
  searchPlaceholder = "Search",
  addButtonText = "Add",
  showProfileImages = false,
  onButtonClick,
  customActions = [],
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    onStatusChange(id, newStatus);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAction = (row, action) => {
    onRowAction(row, action);
    setActiveDropdown(null);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus =
      !statusFilter ||
      (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="navtop">
          <h2 className="table-title">{title}</h2>
          <div className="navright">
            <img src="/icons/mail.svg" alt="mail" width={30} height={30} />
            <img src="/icons/bell.svg" alt="mail" width={30} height={30} />
            <img src="/images/profile.png" alt="mail" width={30} height={30} />
            <img src="/icons/down.svg" alt="mail" width={10} height={20} />
          </div>
        </div>
      </div>
      <div className="table-header">
        <div className="table-controls">
          {/* Filter dropdown */}
          {filterOptions.length > 0 && (
            <div className="filter-container">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="nav2right">
            {/* Search input */}
            <div className="search-box">
              <img
                src="/icons/search.svg"
                alt="Search"
                width={20}
                height={20}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {showAddButton && (
              <button onClick={onButtonClick}>{addButtonText}</button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.sortable ? "sortable-column" : ""}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="column-header">
                    {column.label}
                    {column.sortable && (
                      <span className="sort-icon">
                        {sortColumn === column.key
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <tr key={index} className="table-row">
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.key === "profile" && showProfileImages ? (
                        <div className="profile-image">
                          {row.profileImage ? (
                            <img
                              src={row.profileImage}
                              alt={`${row.name || "User"} profile`}
                            />
                          ) : (
                            <div className="profile-placeholder">
                              {(row.name?.charAt(0) || "?").toUpperCase()}
                            </div>
                          )}
                        </div>
                      ) : column.key === "status" ? (
                        <StatusDropdown
                          value={row.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            if (row.status !== newStatus) {
                              handleStatusChange(row.id, newStatus);
                            }
                          }}
                          statusOptions={statusOptions}
                        />
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                  <td className="action-cell">
                    <div className="action-dropdown-container">
                      <button
                        onClick={() => toggleDropdown(row.id)}
                        className="action-button"
                      >
                        ⋮
                      </button>
                      {activeDropdown === row.id && (
                        <div className="action-dropdown">
                          {customActions.length > 0 ? (
                            customActions.map((action, index) => (
                              <button
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleAction(row, action.type)}
                              >
                                {action.label}
                              </button>
                            ))
                          ) : (
                            <>
                              <button
                                className="dropdown-item"
                                onClick={() => handleAction(row, "download")}
                              >
                                Download Resume
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleAction(row, "delete")}
                              >
                                Delete Candidate
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="no-data">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        color: "#D97706",
        borderColor: "#FACC15",
        backgroundColor: "#FEF3C7",
      }; // Yellow
    case "approved":
    case "selected":
      return {
        color: "#047857",
        borderColor: "#10B981",
        backgroundColor: "#D1FAE5",
      }; // Green
    case "interviewed":
      return {
        color: "#1ABC9C",
        borderColor: "#1ABC9C",
        backgroundColor: "#E0F7F4",
      }; // Green
    case "rejected":
      return {
        color: "#B91C1C",
        borderColor: "#F87171",
        backgroundColor: "#FEE2E2",
      }; // Red
    case "on hold":
      return {
        color: "#F97316",
        borderColor: "#F97316",
        backgroundColor: "#fff",
      }; // Orange
    default:
      return {
        color: "#374151",
        borderColor: "#D1D5DB",
        backgroundColor: "#F3F4F6",
      }; // Default Gray
  }
};

const StatusDropdown = ({ value, onChange, statusOptions }) => {
  const styles = getStatusStyles(value);

  return (
    <select
      className="status-dropdown"
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        border: `2px solid ${styles.borderColor}`,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontWeight: "bold",
        cursor: "pointer",
        outline: "none",
      }}
      value={value}
      onChange={onChange}
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};
