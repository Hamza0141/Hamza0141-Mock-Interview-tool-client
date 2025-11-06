import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./PrivateRoute";
import Loader from "../components/Loader";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Notes = lazy(() => import("../pages/Notes"));
import ErrorBoundary from "../components/ErrorBoundary";
import Pricing from "../pages/Pricing";

// const Interviews = lazy(() => import("../pages/Interviews"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes with Dashboard layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/interviews"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Interviews />
              </DashboardLayout>
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Pricing />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ErrorBoundary>
                  <Notes />
                </ErrorBoundary>
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
