import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import endPoint from "./routers/router";
import AuthPage from "@pages/AuthPage";
import Login from "@pages/AuthPage/Login";
import Register from "@pages/AuthPage/Register";
import HomePage from "@pages/HomePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={endPoint.HOMEPAGE} replace />} />
        <Route path={endPoint.HOMEPAGE} element={<HomePage />} />

        {/* Nested Auth routes */}
        <Route path={endPoint.AUTHPAGE} element={<AuthPage />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
