import { useRef, useEffect, useState } from "react";
import {
  FiUsers,
  FiSettings,
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BarChartOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import logo from "@assets/logo.png";
import logo2 from "@assets/logo2.png";
import { useTheme } from "@components/Theme_Context";
import Tooltip from "@mui/material/Tooltip";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const { darkMode, toggleTheme } = useTheme();

  const user = {
    name: "Nguyễn Văn A",
    email: "a.nguyen@example.com",
    avatar: "https://i.pravatar.cc/100?img=3",
  };

  const guestMenuItems = [
    { label: "Thông tin cá nhân", href: "#", icon: <FiSettings /> },
    { label: "Đăng xuất", href: "#", isDanger: true },
  ];

  const menuItems = [
    { name: "Statistic", icon: <BarChartOutlined />, path: "/adminLayout" },
    {
      name: "User Management",
      icon: <UserOutlined />,
      path: "/adminLayout/userManagement",
    },
    {
      name: "Blog Management",
      icon: <FileTextOutlined />,
      path: "/adminLayout/blogManagement",
    },
  ];

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

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "min-w-60 max-w-60" : "min-w-16 max-w-16"
        } transition-all duration-500 ease-in-out 
        bg-white dark:bg-gray-800 p-2 shadow-xl overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-2">
          {sidebarOpen ? (
            <img src={logo} alt="Logo" className="object-contain " />
          ) : (
            <img src={logo2} alt="Logo" className="ml-1 mt-1 object-contain w-10 h-10" />
          )}
        </div>
        <hr className="border-gray-200 mb-2" />
        <nav>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const button = (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full p-2 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } justify-start`}
                style={
                  sidebarOpen
                    ? {}
                    : { paddingLeft: "0.88rem", paddingRight: "0.75rem" }
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    sidebarOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                  }`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {item.name}
                </span>
              </button>
            );

            return sidebarOpen ? (
              button
            ) : (
              <Tooltip
                title={item.name}
                placement="right"
                arrow
                key={item.name}
              >
                {button}
              </Tooltip>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-3 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Tooltip title={sidebarOpen ? "Close" : "Open"} arrow>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 hover:border-blue-100 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <FiMenu />
            </button>
          </Tooltip>

          <div className="flex items-center space-x-4 relative">
            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} arrow>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? (
                  <FiSun className="text-yellow-400 text-xl" />
                ) : (
                  <FiMoon className="text-gray-800 dark:text-white text-xl" />
                )}
              </button>
            </Tooltip>

            <div className="relative">
              <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="flex items-center space-x-2 p-1 pr-3 bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full shadow-sm transition duration-300"
              >
                <img
                  src={user?.avatar}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-yellow-600"
                />
                <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-white">
                  {user?.name}
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
