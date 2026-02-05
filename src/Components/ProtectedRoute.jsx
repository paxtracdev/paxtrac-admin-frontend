import Layout from "./Layout";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => { 
  // const token = localStorage.getItem("token");
  // if(!token){
  //   return <Navigate to="/login" />;
  // }
  return (
    <>  
      <Layout />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;