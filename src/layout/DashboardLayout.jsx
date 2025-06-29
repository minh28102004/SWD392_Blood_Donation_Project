import { useRef, useEffect, useState } from "react";
import {
  FiUserPlus,
  FiLogOut,
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";
import { MdBloodtype, MdInventory, MdRequestPage } from "react-icons/md";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@redux/features/authSlice";
import { persistor } from "@redux/store/store";
import Avatar from "@components/Avatar_User_Image";
import { jwtDecode } from "jwt-decode";
import { fetchUserById } from "@redux/features/userSlice";
import {
  BarChartOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import logo from "@assets/logo.png";
import logo2 from "@assets/logo2.png";
import { useTheme } from "@components/Theme_Context";
import Tooltip from "@mui/material/Tooltip";
import useOutsideClick from "@hooks/useOutsideClick";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [localUser, setLocalUser] = useState(null); // Local user riêng

  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.user);

  useOutsideClick(dropdownRef, () => setIsUserMenuOpen(false), isUserMenuOpen);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (token && savedUser && !selectedUser) {
      const decoded = jwtDecode(token);
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      if (userId) {
        dispatch(fetchUserById(userId));
      }
    }
  }, [dispatch, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      setLocalUser(selectedUser); // Cập nhật localUser khi Redux có dữ liệu
    }
  }, [selectedUser]);

  const handleUserProfileClick = () => {
    if (selectedUser) {
      navigate("/userProfile", { state: { user: selectedUser } });
    } else {
      console.log("User data is loading...");
    }
    setIsUserMenuOpen(false);
  };

  let menuItems = [];

  const menuItemsAdmin = [
    {
      name: "Statistic",
      icon: <BarChartOutlined />,
      path: "/dashboard/statistic",
    },
    {
      name: "User Management",
      icon: <UserOutlined />,
      path: "/dashboard/userManagement",
    },
    {
      name: "Blog Management",
      icon: <FileTextOutlined />,
      path: "/dashboard/blogManagement",
    },
  ];

  const menuItemsStaff = [
    {
      name: "Blood Requests",
      icon: <MdRequestPage />,
      path: "/dashboard/bloodRequests",
    },
    {
      name: "Blood Inventory",
      icon: <MdInventory />,
      path: "/dashboard/bloodInventory",
    },
    { name: "Blood Type", icon: <MdInventory />, path: "/dashboard/bloodType" },
    {
      name: "Blood Component",
      icon: <MdBloodtype />,
      path: "/dashboard/bloodComponent",
    },
    {
      name: "Blood Donation",
      icon: <MdInventory />,
      path: "/dashboard/bloodDonation",
    },
  ];

  if (role === "Admin") menuItems = menuItemsAdmin;
  else if (role === "Staff") menuItems = menuItemsStaff;

  const userMenuItems = [
    {
      label: "User Profile",
      icon: <FiUserPlus className="mr-2 text-lg" />,
      onClick: handleUserProfileClick,
    },
    {
      label: "Logout",
      icon: <FiLogOut className="mr-2 text-lg text-red-600" />,
      isDanger: true,
      onClick: () => {
        setIsUserMenuOpen(false);
        setLoadingLogout(true);
        setTimeout(async () => {
          await dispatch(logout());
          await persistor.purge();
          window.location.replace("/"); 
        }, 250);
      },
    },
  ];

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
        } transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 p-2 shadow-xl overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-2">
          {sidebarOpen ? (
            <img src={logo} alt="Logo" className="object-contain" />
          ) : (
            <img
              src={logo2}
              alt="Logo"
              className="ml-1 mt-1 object-contain w-10 h-10"
            />
          )}
        </div>
        <hr className="border-gray-200 mb-2" />
        <nav>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
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
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1 pr-3 bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full shadow-sm transition duration-300"
              >
                <Avatar
                  name={localUser?.name}
                  avatarUrl={localUser?.avatar}
                  size={36}
                />
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Logging out...
                    </div>
                  ) : (
                    localUser?.userName || "Unknown"
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
                {localUser && (
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-sm text-gray-800 dark:text-white font-semibold">
                      {localUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {localUser?.email}
                    </p>
                  </div>
                )}
                <div className="py-1">
                  {userMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        item.isDanger
                          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-gray-700"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
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
