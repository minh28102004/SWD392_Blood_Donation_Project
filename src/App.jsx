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
import Content from "@pages/HomePage/Content";
import FAQs from "@pages/HomePage/FAQs";
import Blog from "@pages/HomePage/Blog";
import About_blood from "@pages/HomePage/About_blood";
import AdminLayout from "@pages/AdminLayout/Dashboard";
import Statistic from "@pages/AdminLayout/Statistics";
import UserManagement from "@pages/AdminLayout/User_Management";
import UserProfile from "@pages/HomePage/User_Profile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={endPoint.HOMEPAGE} replace />} />
        <Route path={endPoint.HOMEPAGE} element={<HomePage />}>
          <Route index element={<Content />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="blog" element={<Blog />} />
          <Route path="about_blood" element={<About_blood />} />
        </Route>
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path={endPoint.ADMINLAYOUT} element={<AdminLayout />}>
          <Route index element={<Statistic />} />
          <Route path="userManagement" element={<UserManagement />} />
        </Route>
        <Route path={endPoint.AUTHPAGE} element={<AuthPage />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
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
