import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@redux/store/store";
import endPoint from "./routers/router";
// Pages
import AuthPage from "@pages/AuthPage";
import Login from "@pages/AuthPage/Login";
import Register from "@pages/AuthPage/Register";
import HomePage from "@pages/HomePage/HomePage";
import Content from "@pages/HomePage/Content";
import FAQs from "@pages/HomePage/FAQs";
import Blog from "@pages/HomePage/Blog";
import Contact from "@pages/HomePage/Contact";
import AdminLayout from "@pages/AdminLayout/Dashboard";
import Statistic from "@pages/AdminLayout/Statistics";
import UserManagement from "@pages/AdminLayout/User_Management";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={endPoint.HOMEPAGE} replace />} />
        <Route path={endPoint.HOMEPAGE} element={<HomePage />}>
          <Route index element={<Content />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>
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
      <AppRoutes />
    </Provider>
  );
}

export default App;
