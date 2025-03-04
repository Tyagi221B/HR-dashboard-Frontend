import React, { useState, useEffect } from "react";
import "../css/Table.css";

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
  mobileDisplayFields = [], 
  mobileCardConfig = {
    titleField: "fullName", // Field to use as the card title
    subtitleField: "position", // Field to use as subtitle (can be null)
    statusField: "status", // Field to use for status dropdown (can be null)
    initialVisibleFields: [], // Fields to show by default (before expand)
  },
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdown &&
        !event.target.closest(".action-dropdown-container")
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

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

  // Helper function to get display fields for mobile view
  const getMobileDisplayFields = (row) => {
    // If explicit mobileDisplayFields are provided, use those
    if (mobileDisplayFields && mobileDisplayFields.length > 0) {
      return mobileDisplayFields;
    }
    
    // Otherwise, derive from columns (excluding non-displayable fields)
    return columns
      .filter(col => 
        // Filter out special fields that are handled separately
        col.key !== mobileCardConfig.titleField && 
        col.key !== mobileCardConfig.subtitleField &&
        col.key !== mobileCardConfig.statusField &&
        col.key !== "id" && 
        col.key !== "srNo" &&
        // Only include fields that actually exist in the data
        row[col.key] !== undefined
      )
      .map(col => ({
        key: col.key,
        label: col.label
      }));
  };

  // Mobile card view rendering
  const renderMobileCards = () => {
    return sortedData.map((row) => {
      const displayFields = getMobileDisplayFields(row);
      const initialFields = mobileCardConfig.initialVisibleFields.length > 0 
        ? displayFields.filter(field => mobileCardConfig.initialVisibleFields.includes(field.key))
        : displayFields.slice(0, 3); // Default to first 3 fields if not specified
      
      const expandableFields = displayFields.filter(
        field => !mobileCardConfig.initialVisibleFields.includes(field.key)
      );
      
      const hasExpandableContent = expandableFields.length > 0;

      return (
        <div key={row.id} className="mobile-card">
          <div className="mobile-card-header">
            <div>
              {/* Title field - always show */}
              <strong>{row[mobileCardConfig.titleField] || "No title"}</strong>
              
              {/* Subtitle field - show if defined and exists */}
              {mobileCardConfig.subtitleField && row[mobileCardConfig.subtitleField] && (
                <div className="mobile-position">{row[mobileCardConfig.subtitleField]}</div>
              )}
            </div>
            
            {/* Status dropdown - show if defined and exists */}
            {mobileCardConfig.statusField && row[mobileCardConfig.statusField] && statusOptions.length > 0 && (
              <StatusDropdown
                value={row[mobileCardConfig.statusField]}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (row[mobileCardConfig.statusField] !== newStatus) {
                    handleStatusChange(row.id, newStatus);
                  }
                }}
                statusOptions={statusOptions}
              />
            )}
          </div>

          <div className="mobile-card-content">
            {/* Initial visible fields */}
            {initialFields.map((field) => (
              <div key={field.key} className="mobile-card-row">
                <span>{field.label}:</span>
                <span>{row[field.key]}</span>
              </div>
            ))}
            
            {/* Expanded/hidden fields */}
            {expandedRow === row.id && expandableFields.map((field) => (
              <div key={field.key} className="mobile-card-row">
                <span>{field.label}:</span>
                <span>{row[field.key]}</span>
              </div>
            ))}
          </div>

          <div className="mobile-card-footer">
            {/* Show expand button only if there are expandable fields */}
            {hasExpandableContent && (
              <button
                className="mobile-expand-btn"
                onClick={() => toggleExpandRow(row.id)}
              >
                {expandedRow === row.id ? "Show Less" : "Show More"}
              </button>
            )}

            <div className="mobile-actions">
              {customActions.map((action, index) => (
                <button
                  key={index}
                  className="mobile-action-btn"
                  onClick={() => handleAction(row, action.type)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="navtop">
          <h2 className="table-title">{title}</h2>
          <div className="navright">
            <img src="/icons/mail.svg" alt="mail" width={30} height={30} />
            <img src="/icons/bell.svg" alt="bell" width={30} height={30} />
            <img
              src="/images/profile.png"
              alt="profile"
              width={30}
              height={30}
            />
            <img src="/icons/down.svg" alt="down" width={10} height={20} />
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
                <option value="">All</option>
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
            {/* Always show add button but position it properly in mobile */}
            {showAddButton && (
              <button onClick={onButtonClick} className="add-button">
                {addButtonText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cards Container */}
      {isMobile && (
        <div className="mobile-cards-container">
          {sortedData.length > 0 ? (
            renderMobileCards()
          ) : (
            <div className="no-data">No data found</div>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      {!isMobile && (
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
      )}
    </div>
  );
};

export default Table;

// StatusDropdown component
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

// Helper function for status colors
const getStatusStyles = (status) => {
  // Add this check to handle undefined or null status
  if (!status) {
    return {
      color: "#374151",
      borderColor: "#D1D5DB",
      backgroundColor: "#F3F4F6",
    }; // Default Gray
  }

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
    case "present":
      return {
        color: "#1ABC9C",
        borderColor: "#1ABC9C",
        backgroundColor: "#E0F7F4",
      }; // Green
    case "rejected":
    case "absent":
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