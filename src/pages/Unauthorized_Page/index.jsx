import React from "react";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UnauthorizedAccess = () => {
  const navigate = useNavigate(); // Create navigate function

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-2); 
    } else {
      navigate("/"); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-200 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-6 rounded-full">
              <FaLock className="text-red-600 w-16 h-16" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            403 - Access Denied
          </h1>

          <div className="space-y-4">
            <p className="text-xl text-gray-600">
              You do not have permission to access this page.
            </p>
            <p className="text-gray-500">
              Please ensure you have the necessary credentials or contact
              support for assistance.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-rose-400 to-red-500 text-white rounded-lg hover:brightness-90 transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200">
            <p> © 2025 BloodLife. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
