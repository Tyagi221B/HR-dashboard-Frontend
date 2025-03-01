import React, { useState } from "react";
import "../css/ReusableTable.css";

const ReusableTable = ({
  title,
  columns,
  data,
  onRowAction,
  filterOptions = [],
  statusOptions = [],
  searchPlaceholder = "Search",
  showProfileImages = false,
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tableData, setTableData] = useState(data); // State to hold updated data

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle status change in dropdown
  const handleStatusChange = (id, newStatus) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    console.log(`Updated status for ID ${id}: ${newStatus}`);
  };

  // Filter data based on search and status
  const filteredData = tableData.filter((item) => {
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

  // Sort data
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
        <h2 className="table-title">{title}</h2>

        <div className="table-controls">
          {/* Search input */}
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
                          onChange={(e) =>
                            handleStatusChange(row.id, e.target.value)
                          }
                          statusOptions={statusOptions}
                        />
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => onRowAction(row)}
                      className="action-button"
                    >
                      ⋮
                    </button>
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

export default ReusableTable;

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
