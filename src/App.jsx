import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "@redux/store/store";
import endPoint from "./routers/router";
import ErrorBoundary from "@components/Error_Boundary";
import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoute from "@services/ProtectedRoute";
import RoleRedirectWrapper from "@services/roleRedirectWrapper";
// Pages
import AuthPage from "@pages/AuthPage";
import Login from "@pages/AuthPage/Login";
import Register from "@pages/AuthPage/Register";
import HomePage from "@pages/HomePage/HomePage";
import Home from "@pages/HomePage/Home";
import FAQs from "@pages/HomePage/FAQs";
import Blog from "@pages/HomePage/Blog";
import About_blood from "@pages/HomePage/About_blood";
import Statistic from "@layout/AdminLayout/Statistics";
import UserManagement from "@layout/AdminLayout/User_Management";
import BlogManagement from "@layout/AdminLayout/Blog_Management";
import BloodRequests from "@layout/StaffLayout/BloodRequests";
import BloodInventory from "@layout/StaffLayout/BloodInventory";
import BloodType from "@layout/StaffLayout/BloodType";
import BloodComponentManagement from "@layout/StaffLayout/BloodComponent";
import BloodDonation from "@layout/StaffLayout/BloodDonation";
import UserProfile from "@pages/User_Profile";
import UserHistory from "@pages/User_History/userHistory";
import UnauthorizedPage from "@pages/Unauthorized_Page";
import DashBoardLayout from "@layout/DashboardLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={endPoint.HOMEPAGE} replace />} />

        {/* Public Routes */}
        <Route
          path={endPoint.HOMEPAGE}
          element={
            <RoleRedirectWrapper>
              <HomePage />
            </RoleRedirectWrapper>
          }
        >
          <Route index element={<Home />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="blog" element={<Blog />} />
          <Route path="aboutBlood" element={<About_blood />} />
        </Route>

        <Route path={endPoint.USERPROFILE} element={<UserProfile />} />
        <Route path={endPoint.USERHISTORY} element={<UserHistory />} />
        <Route
          path={endPoint.UNAUTHORIZEDPAGE}
          element={<UnauthorizedPage />}
        />

        {/* Dashboard Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<DashBoardLayout />}
              requiredRole="Admin"
            />
          }
        >
          {/* Admin Pages */}
          <Route path="statistic" element={<Statistic />} />
          <Route path="userManagement" element={<UserManagement />} />
          <Route path="blogManagement" element={<BlogManagement />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<DashBoardLayout />}
              requiredRole="Staff"
            />
          }
        >
          {/* Staff Pages */}
          <Route path="bloodRequests" element={<BloodRequests />} />
          <Route path="bloodInventory" element={<BloodInventory />} />
          <Route path="bloodDonation" element={<BloodDonation />} />
          <Route path="bloodType" element={<BloodType />} />
          <Route path="bloodComponent" element={<BloodComponentManagement />} />
        </Route>

        {/* Auth Pages */}
        <Route path={endPoint.AUTHPAGE} element={<AuthPage />}>
          <Route path={endPoint.LOGIN} element={<Login />} />
          <Route path={endPoint.REGISTER} element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

export default App;
