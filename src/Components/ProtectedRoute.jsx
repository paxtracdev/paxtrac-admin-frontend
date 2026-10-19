import Layout from "./Layout";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    user = null;
  }

  // If no token or role is not admin, redirect to login
  if (!token || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If token exists, render layout with nested routes
  return (
    <>
     <Layout />
      <Outlet />
      </>
  );
};

export default ProtectedRoute;
