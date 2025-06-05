import React, { Component } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiHome,
  FiAlertTriangle,
  FiRefreshCcw,
  FiArrowLeft,
} from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsOpen: false,
      copySuccess: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  toggleDetails = () => {
    this.setState((prevState) => ({
      isDetailsOpen: !prevState.isDetailsOpen,
    }));
  };

  copyErrorDetails = () => {
    const errorDetails = `Error: ${this.state.error?.toString()}\nStack Trace: ${
      this.state.errorInfo?.componentStack
    }`;
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copySuccess: true });
      setTimeout(() => this.setState({ copySuccess: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-red-100">
            <div className="flex flex-col items-center">
              <div className="relative">
                <FiAlertTriangle className="w-24 h-24 text-red-500 animate-bounce" />
                <div className="absolute inset-0 bg-red-300 opacity-20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h2 className="mt-8 text-3xl font-extrabold text-gray-900 text-center">
                Oops! Something went wrong
              </h2>
              <p className="mt-3 text-base text-gray-600 text-center max-w-md">
                We've encountered an unexpected error. Our team has been
                notified and is working on it.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <button
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-red-200 transition-all duration-200 group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                  View Errors Details
                </span>
                {this.state.isDetailsOpen ? (
                  <FiChevronUp className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                )}
              </button>

              {this.state.isDetailsOpen && (
                <div className="bg-gray-50 p-6 rounded-xl space-y-3 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <pre className="text-xs text-gray-700 overflow-auto max-h-60 w-full">
                      {this.state.error?.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                    <Tooltip title="Copy">
                    <button
                      onClick={this.copyErrorDetails}
                      className="ml-4 p-2 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md"
                      title="Copy error details"
                    >
                      {this.state.copySuccess ? (
                        <span className="text-green-500 text-lg">✓</span>
                      ) : (
                        <FiCopy className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    </Tooltip>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mt-6">
                {/* Return Back Button */}
                <button
                  onClick={() => {
                    window.history.go(-1); 
                    setTimeout(() => {
                      window.location.reload();
                    }, 300); 
                  }}
                  className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-br from-sky-400 to-blue-500 hover:bg-gradient-to-br hover:from-sky-500 hover:to-blue-600 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  Return Back
                </button>

                {/* Refresh Page Button */}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-br from-rose-400 to-red-500 hover:bg-gradient-to-br hover:from-rose-500 hover:to-red-600 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiRefreshCcw className="w-4 h-4 mr-2" />
                  Refresh Page
                </button>

                {/* Home Button */}
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-white bg-gradient-to-br from-gray-500 to-gray-600 hover:bg-gradient-to-br hover:from-gray-600 hover:to-gray-700 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiHome className="w-4 h-4 mr-2" />
                  Home
                </button>
              </div>

              <div className="pt-6 text-center border-t border-gray-200">
                <p className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors duration-200">
                  © 2025 BloodLife. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
