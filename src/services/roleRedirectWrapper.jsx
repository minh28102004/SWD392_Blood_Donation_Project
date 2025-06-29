import { Navigate } from "react-router-dom";

const RoleRedirectWrapper = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  if (role === "Admin") {
    return <Navigate to="/dashboard/statistic" replace />;
  }

  if (role === "Staff") {
    return <Navigate to="/dashboard/bloodRequests" replace />;
  }

  return children;
};

export default RoleRedirectWrapper;
