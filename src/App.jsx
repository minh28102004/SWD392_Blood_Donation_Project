import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@redux/store/store";
import endPoint from "./routers/router";
import ErrorBoundary from "@components/Error_Boundary";
// Pages
import AuthPage from "@pages/AuthPage";
import Login from "@pages/AuthPage/Login";
import Register from "@pages/AuthPage/Register";
import HomePage from "@pages/HomePage/HomePage";
import Home from "@pages/HomePage/Home";
import FAQs from "@pages/HomePage/FAQs";
import Blog from "@pages/HomePage/Blog";
import About_blood from "@pages/HomePage/About_blood";
import AdminLayout from "@layout/AdminLayout/Dashboard";
import Statistic from "@layout/AdminLayout/Statistics";
import UserManagement from "@layout/AdminLayout/User_Management";
import BlogManagement from "@layout/AdminLayout/Blog_Management";
import StaffLayout from "@layout/StaffLayout/Dashboard";
import StaffStatistic from "@layout/StaffLayout/Donation";
import StaffManagement from "@layout/StaffLayout/User_Management";
import UserProfile from "@pages/User_Profile";
import UserHistory from "@pages/User_Request_History";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={endPoint.HOMEPAGE} replace />} />
        <Route path={endPoint.HOMEPAGE} element={<HomePage />}>
          <Route index element={<Home />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="blog" element={<Blog />} />
          <Route path="aboutBlood" element={<About_blood />} />
        </Route>
        <Route path={endPoint.USERPROFILE} element={<UserProfile />} />
        <Route path={endPoint.USERHISTORY} element={<UserHistory />} />
        <Route path={endPoint.ADMINLAYOUT} element={<AdminLayout />}>
          <Route index element={<Statistic />} />
          <Route path="userManagement" element={<UserManagement />} />
          <Route path="blogManagement" element={<BlogManagement />} />
        </Route>
        <Route path={endPoint.STAFFLAYOUT} element={<StaffLayout />}>
          <Route index element={<StaffStatistic />} />
          <Route path="staffManagement" element={<StaffManagement />} />
        </Route>
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
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
