import { Navigate, Outlet } from "react-router";

interface Props {
  allowedRoles: string[];
}

const RoleProtected = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) return <Navigate to="/auth/login" replace />;

  const user = JSON.parse(userRaw);
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Outlet ini yang akan merender children di Router.tsx
  return <Outlet />;
};

export default RoleProtected;