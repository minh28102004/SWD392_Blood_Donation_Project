import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@pages/HomePage/Header";
import Footer from "@pages/HomePage/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      {/* Main */}
      <Outlet />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
