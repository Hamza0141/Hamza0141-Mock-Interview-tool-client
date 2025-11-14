import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./PrivateRoute";
import Loader from "../components/Loader";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import DashboardLayout from "../layouts/DashboardLayout";

const InterviewPage = lazy(() => import("../pages/Interview"));
const InterviewSetup = lazy(() =>
  import("../pages/InterviewSessionSetup")
);

const PublicSpeechSetup = lazy(() =>
  import("../pages/PublicSpeechSetup")
);
const PublicSession = lazy(() => import("../pages/PublicSpeechSession"));

const InterviewSession = lazy(() => import("../pages/InterviewSession"));
const EvaluationPage = lazy(() => import("../pages/EvaluationPage"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Notes = lazy(() => import("../pages/Notes"));
const Report = lazy(() => import("../pages/ReportPage"));
const SpeechEvaluation = lazy(() => import("../pages/SpeechEvaluation"));
const BuyCreditsPage = lazy(() => import("../pages/BuyCreditsPage"))
import ErrorBoundary from "../components/ErrorBoundary";
import Pricing from "../pages/Pricing";

// const Interviews = lazy(() => import("../pages/Interviews"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
    const { user, status } = useAppSelector((state) => state.user);
   const profileId = user.profile_id;
   console.log(profileId);
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
          path="/interview"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <InterviewPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <DashboardLayout>
                  <Report />
                </DashboardLayout>
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/speech/:speech_id"
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <DashboardLayout>
                  <SpeechEvaluation />
                </DashboardLayout>
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/interview/interviewSetup"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <InterviewSetup />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/speech/setup"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <PublicSpeechSetup />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/interview/session"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <InterviewSession />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/speech/session"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <PublicSession />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/evaluation/:session_id"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <EvaluationPage />
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
          path="/buy-credits"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <BuyCreditsPage profileId={profileId} />
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
