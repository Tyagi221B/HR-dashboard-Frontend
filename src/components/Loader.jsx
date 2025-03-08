import React, { useState, useEffect } from 'react';
import "../css/Loader.css";

const Loader = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div className="loader-container">
      <div className="dots-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Loading, please wait...</p>
      <p>{showMessage ? "Our server was having a snooze, but it's waking up now!" : "We're brewing some magic, hang tight!"}</p>
    </div>
  );
};

export default Loader;
