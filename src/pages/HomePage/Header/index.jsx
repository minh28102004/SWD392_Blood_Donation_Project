import React, { useState, useEffect, useRef } from "react";
import {
  FiLogOut,
  FiSettings,
  FiLogIn,
  FiUserPlus,
  FiChevronDown,
  FiMoon,
  FiList,
  FiSun,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import logo from "@assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@components/Theme_Context";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  // Hàm xử lý click vào nút để mở hoặc đóng menu
  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsUserMenuOpen((prevState) => !prevState);
  };

  // Hàm xử lý click ra ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://i.pravatar.cc/300",
  };

  const userMenuItems = [
    {
      label: "User Profile",
      href: "/userProfile",
      icon: <FiUserPlus className="mr-2 text-lg" />,
    },
    {
      label: "User History",
      href: "/userHistory",
      icon: <FiList className="mr-2 text-lg" />,
    },
    {
      label: "Logout",
      href: "/authPage/login",
      icon: <FiLogOut className="mr-2 text-lg text-red-600" />,
      isDanger: true,
    },
  ];

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

  return (
    <header className="fixed w-full bg-white dark:bg-gray-800 shadow-sm z-50 transition-all duration-300 ease-in-out">
      <nav className="container mx-auto shadow-lg px-6 py-1">
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
                <img
                  src={user?.avatar || "https://i.pravatar.cc/100?u=guest"}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-yellow-600"
                />
                <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-white">
                  {user?.name || "Khách"}
                </span>
                <FiChevronDown className="text-gray-500 dark:text-gray-300" />
              </button>

              {/* Dropdown Menu */}
              <div
                ref={dropdownRef}
                className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-xl transform transition-all duration-300 origin-top-right z-50 ${
                  isUserMenuOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                {user && (
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm text-gray-800 dark:text-white font-semibold">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {user.email}
                    </p>
                  </div>
                )}

                <div className="py-1">
                  {(user ? userMenuItems : guestMenuItems).map(
                    (item, index) => (
                      <a
                        key={index}
                        href={item.href}
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
