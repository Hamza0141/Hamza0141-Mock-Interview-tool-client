import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./PrivateRoute";
import Loader from "../components/Loader";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAppSelector } from "../app/hooks";

// ========== TEMPLATE PUBLIC SITE ==========
import RootLayout from "@/layouts/root";
import TemplateHome from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
// import Team from "@/pages/team";
import Faq from "@/pages/faq";
import PricingTemplate from "@/pages/pricing";
import NotFound from "@/pages/not-found";
import CookiesPage from "@/pages/CookiesPage";
import Contact from "@/pages/contact";

// ========== YOUR INTERNAL APP PAGES ==========
const TermsPage = lazy(() => import("../pages/TermsPage"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));
const InterviewPage = lazy(() => import("../pages/Interview"));
const InterviewSetup = lazy(() => import("../pages/InterviewSessionSetup"));
const PublicSpeechSetup = lazy(() => import("../pages/PublicSpeechSetup"));
const PublicSession = lazy(() => import("../pages/PublicSpeechSession"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const FeedbackPage = lazy(() => import("../pages/FeedbackPage"));
const TicketsPage = lazy(() => import("../pages/TicketsPage"));
const TicketDetailPage = lazy(() => import("../pages/TicketDetailPage"));
const InterviewSession = lazy(() => import("../pages/InterviewSession"));
const EvaluationPage = lazy(() => import("../pages/EvaluationPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Notes = lazy(() => import("../pages/Notes"));
const Report = lazy(() => import("../pages/ReportPage"));
const SpeechEvaluation = lazy(() => import("../pages/SpeechEvaluation"));
const BuyCreditsPage = lazy(() => import("../pages/BuyCreditsPage"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

export default function AppRoutes() {
  const { user } = useAppSelector((state) => state.user);
  const profileId = user?.profile_id;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ========= TEMPLATE PUBLIC PAGES (Landing Site) ========= */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<TemplateHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          {/* <Route path="/team" element={<Team />} /> */}
          <Route path="/faq" element={<Faq />} />
          <Route path="/pricing" element={<PricingTemplate />} />
          <Route path="/contact" element={<Contact />} />

        {/* ========= AUTH ROUTES ========= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* =========  LEGAL PAGES ========= */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
          {/* <Route path="/privacy-policy" element={<PrivacyPolicyTemplate />} /> */}
          <Route path="/cookie-policy" element={<CookiesPage />} />
        </Route>


        {/* ========= DASHBOARD SECTION ========= */}
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

        {/* ========= INTERVIEW & SPEECH ROUTES ========= */}
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
          path="/speech/:speech_id"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <SpeechEvaluation />
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

        {/* ========= OTHER DASHBOARD ROUTES ========= */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <NotificationsPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TicketsPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/tickets/:ticketId"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TicketDetailPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Report />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Feedback"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <FeedbackPage />
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
                <Notes />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
