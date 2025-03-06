import "../css/Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="dots-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default Loader;
