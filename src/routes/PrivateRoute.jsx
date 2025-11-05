import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, status } = useAppSelector((state) => state.auth);

  // Wait for Redux to finish checking cookie auth (getProfile)
  if (status === "loading" || status === "verifying") {
    return (
      <div className="flex items-center justify-center h-screen text-[var(--color-text-main)]">
        Checking authentication...
      </div>
    );
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise show the protected page
  return children;
}
