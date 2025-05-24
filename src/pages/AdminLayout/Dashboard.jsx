import { useState, useEffect, useRef } from "react";
import {
  FiUsers,
  FiSettings,
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChartOutlined, UserOutlined } from "@ant-design/icons";
import logo from "@assets/logo.png";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mock user & menu
  const user = {
    name: "Nguyễn Văn A",
    email: "a.nguyen@example.com",
    avatar: "https://i.pravatar.cc/100?img=3",
  };

  const guestMenuItems = [
    { label: "Thông tin cá nhân", href: "#", icon: <FiSettings /> },
    { label: "Đăng xuất", href: "#", isDanger: true },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setThemeLoaded(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  };

  const toggleMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Statistic", icon: <BarChartOutlined />, path: "/adminlayout" },
    {
      name: "User Management",
      icon: <UserOutlined />,
      path: "/adminlayout/userManagement",
    },
  ];

  if (!themeLoaded) return null;

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`
    ${sidebarOpen ? "min-w-60 max-w-60" : "min-w-20 max-w-20"}
    transition-all duration-500 ease-in-out 
    bg-white dark:bg-gray-800 p-4 shadow-xl
    overflow-hidden
  `}
      >
        <div className="flex items-center justify-between mb-5">
          {sidebarOpen && (
            <img
              src={logo}
              alt="Logo"
              className="object-contain"
            />
          )}
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-2 mb-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-3 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiMenu />
          </button>

          <div className="flex items-center space-x-4 relative">
            <button
              onClick={toggleTheme}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? (
                <FiSun className="text-xl" />
              ) : (
                <FiMoon className="text-xl" />
              )}
            </button>

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

              <div
                ref={dropdownRef}
                className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-xl transform transition-all duration-300 origin-top-right z-50 ${
                  isUserMenuOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <p className="text-sm text-gray-800 dark:text-gray-100 font-semibold">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <div className="py-1">
                  {guestMenuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm ${
                        item.isDanger
                          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                          : "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <Outlet context={{ darkMode }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
