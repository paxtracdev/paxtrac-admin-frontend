import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound-container body-bg">
      <h1 className="notfound-title primary-text">404</h1>
      <h2 className="notfound-heading">Page Not Found</h2>
      <p className="notfound-text">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <div className="notfound-buttons">
        <button onClick={() => navigate(-1)} className="button-primary px-4">
          Go Back
        </button>
        <button onClick={() => navigate("/")} className="button-primary px-4">
          Go Home
        </button>
      </div>
      {/* <img
        src="https://cdn-icons-png.flaticon.com/512/7486/7486802.png"
        alt="Not Found"
        className="notfound-img"
      /> */}
    </div>
  );
};
export default NotFound;