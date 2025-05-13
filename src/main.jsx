import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <>
    <App />
    <ToastContainer autoClose={2000} />
  </>
);
