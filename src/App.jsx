import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import endPoint from "./routers/router";
import AuthPage from "@pages/AuthPage";
import Login from "@pages/AuthPage/Login";
import Register from "@pages/AuthPage/Register";
import HomePage from "@pages/HomePage";
import Content from "@components/HomePage/Content";
import FAQs from "@components/HomePage/FAQs";
import Blog from "@components/HomePage/Blog";
// import News from "@components/HomePage/News";
// import Orther from "@components/HomePage/Orther";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /homepage */}
        <Route path="/" element={<Navigate to={endPoint.HOMEPAGE} replace />} />

        {/* HomePage layout with nested routes */}
        <Route path={endPoint.HOMEPAGE} element={<HomePage />}>
          <Route index element={<Content />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="blog" element={<Blog />} />
          {/* <Route path="news" element={<News />} />
          <Route path="orther" element={<Orther />} /> */}
        </Route>

        {/* Auth routes */}
        <Route path={endPoint.AUTHPAGE} element={<AuthPage />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
