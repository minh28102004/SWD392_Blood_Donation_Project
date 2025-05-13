import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import endPoint from "./routers/router";
import AuthPage from "@pages/AuthPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={endPoint.AUTHPAGE} element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
