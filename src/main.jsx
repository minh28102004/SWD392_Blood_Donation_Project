import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@components/Theme_Context";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ThemeProvider>
    <App />
    <ToastContainer autoClose={3000} />
  </ThemeProvider>
);
