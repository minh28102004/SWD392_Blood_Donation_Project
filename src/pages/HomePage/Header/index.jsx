import React, { useState, useEffect, useRef } from "react";
import {
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiChevronDown,
  FiMoon,
  FiList,
  FiSun,
} from "react-icons/fi";
import logo from "@assets/logo.png";
import { href, Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@components/Theme_Context";
import useOutsideClick from "@hooks/useOutsideClick";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@redux/features/authSlice";
import { persistor } from "@redux/store/store";
import Avatar from "@components/Avatar_User_Image";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.user);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsUserMenuOpen((prevState) => !prevState);
  };

  useOutsideClick(dropdownRef, () => setIsUserMenuOpen(false), isUserMenuOpen);

  const handleUserProfileClick = () => {
    if (selectedUser) {
      navigate("/userProfile", { state: { user: selectedUser } });
    } else {
      console.log("User data is loading...");
    }
    setIsUserMenuOpen(false);
  };

  // Trường hợp chưa đăng nhập:
  const guestMenuItems = [
    {
      label: "Log In",
      href: "/authPage/login",
      icon: <FiLogIn className="mr-2 text-lg" />,
    },
    {
      label: "Register",
      href: "/authPage/register",
      icon: <FiUserPlus className="mr-2 text-lg" />,
    },
  ];

  // Cập nhật menu khi đã đăng nhập
  const userMenuItems = [
    {
      label: "User Profile",
      icon: <FiUserPlus className="mr-2 text-lg" />,
      onClick: handleUserProfileClick,
    },
    {
      label: "Request History",
      href: "/userHistory",
      icon: <FiList className="mr-2 text-lg" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <FiLogOut className="mr-2 text-lg text-red-600" />,
      isDanger: true,
      onClick: async () => {
        setLoadingLogout(true);
        setIsUserMenuOpen(false);
        dispatch(logout());
        await persistor.purge();
      },
    },
  ];

  useEffect(() => {
    if (loadingLogout) {
      const timeoutId = setTimeout(() => {}, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [loadingLogout]);

  return (
    <header className="fixed w-full bg-white dark:bg-gray-800 shadow-sm z-50 transition-all duration-300 ease-in-out">
      <nav className="container max-w-none shadow-lg px-6 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="BloodLife Logo" className="h-14 w-auto" />
          </div>

          {/* Navigation */}
          <div className="hidden md:flex space-x-10 text-base font-semibold">
            {[
              { label: "Home", path: "/homePage" },
              { label: "FAQs", path: "/homePage/faqs" },
              { label: "Blog", path: "/homePage/blog" },
              { label: "About blood", path: "/homePage/aboutBlood" },
            ].map(({ label, path }, index) => {
              const isActive = location.pathname === path;

              return (
                <Link
                  key={index}
                  to={path}
                  className={`relative group transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-blue-600 dark:text-yellow-500"
                      : "text-black hover:text-blue-700 dark:text-white dark:hover:text-yellow-500"
                  }`}
                >
                  {label}
                  {!isActive && (
                    <span className="absolute left-0 -bottom-1 h-0.5 bg-blue-600 dark:bg-yellow-500 w-0 group-hover:w-full transition-all duration-300 ease-in-out" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Theme toggle & Account */}
          <div className="flex items-center space-x-4 relative">
            {/* Toggle Theme Button */}
            <button
              onClick={toggleTheme}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
            >
              {darkMode ? (
                <FiSun className="text-yellow-400 text-xl" />
              ) : (
                <FiMoon className="text-gray-800 dark:text-white text-xl" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="flex items-center space-x-2 p-1 pr-3 bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full shadow-sm transition duration-300"
              >
                <Avatar name={selectedUser?.name} avatarUrl={selectedUser?.avatar} size={36} />
                <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-white">
                  {loadingLogout ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-6 w-6 mr-2 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Logging out...
                    </div>
                  ) : (
                    selectedUser?.userName || "Unknown"
                  )}
                </span>
                <FiChevronDown className="text-gray-500 dark:text-gray-300" />
              </button>

              {/* Dropdown Menu */}
              <div
                ref={dropdownRef}
                className={`absolute right-0 mt-2 transition-all duration-300 origin-top-right z-50 ${
                  isUserMenuOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                } ${
                  user ? "w-48" : "w-36"
                } bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-xl`}
              >
                {user && (
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm text-gray-800 dark:text-white font-semibold">
                      {selectedUser.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {selectedUser.email}
                    </p>
                  </div>
                )}

                <div className="py-1">
                  {(user ? userMenuItems : guestMenuItems).map(
                    (item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        onClick={item.onClick}
                        className={`flex items-center px-4 py-2 text-sm ${
                          item.isDanger
                            ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700"
                        }`}
                      >
                        {item.icon && item.icon}
                        {item.label}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
