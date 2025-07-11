import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/authPage/login");
    } else if (requiredRole && role !== requiredRole) {
      navigate("/unauthorizedPage");
    }
  }, [user, role, requiredRole, navigate]);

  // Trường hợp đang redirect thì không render gì cả
  if (!user || (requiredRole && role !== requiredRole)) {
    return null;
  }

  return element;
};

export default ProtectedRoute;
