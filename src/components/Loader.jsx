import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-container">
      {/* Header Section */}
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-actions">
          <div className="skeleton-search"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>

      {/* Table Header */}
      <div className="skeleton-table-header">
        <div className="skeleton-header-cell"></div>
        <div className="skeleton-header-cell"></div>
        <div className="skeleton-header-cell"></div>
        <div className="skeleton-header-cell"></div>
        <div className="skeleton-header-cell"></div>
        <div className="skeleton-header-cell"></div>
        <div className="skeleton-header-cell"></div>
      </div>

      {/* Table Rows */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="skeleton-row">
          <div className="skeleton-cell small"></div>
          <div className="skeleton-cell medium"></div>
          <div className="skeleton-cell medium"></div>
          <div className="skeleton-cell medium"></div>
          <div className="skeleton-cell medium"></div>
          <div className="skeleton-cell small"></div>
          <div className="skeleton-cell small"></div>
          <div className="skeleton-cell tiny"></div>
        </div>
      ))}

     
    </div>
  );
};

export default SkeletonLoader;