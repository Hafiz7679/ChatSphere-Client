import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const Chat = lazy(() => import("../pages/Chat"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AdminLayout = lazy(() => import("../admin/Layout/AdminLayout"));
const AdminDashboard = lazy(() => import("../admin/Dashboard/Dashboard"));
const AdminUsers = lazy(() => import("../admin/Users/Users"));
const AdminAnalytics = lazy(() => import("../admin/Analytics/Analytics"));
const AdminReports = lazy(() => import("../admin/Reports/Reports"));
const AdminServerHealth = lazy(() => import("../admin/ServerHealth/ServerHealth"));
const AdminSettings = lazy(() => import("../admin/Settings/Settings"));

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") return <Navigate to="/chat" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/chat"
          element={<ProtectedRoute><Chat /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="health" element={<AdminServerHealth />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
