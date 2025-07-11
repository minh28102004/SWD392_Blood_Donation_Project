import { useRef, useEffect, useState } from "react";
import { FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { MdBloodtype, MdInventory, MdRequestPage } from "react-icons/md";
import { Outlet, useNavigate, useLocation, href } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@redux/features/authSlice";
import { persistor } from "@redux/store/store";
import Avatar from "@components/Avatar_User_Image";
import { jwtDecode } from "jwt-decode";
import {
  fetchUserById,
  fetchUserRoles,
  fetchUserStatuses,
} from "@redux/features/userSlice";
import {
  BarChartOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import logo from "@assets/logo.png";
import logo2 from "@assets/logo2.png";
import { useTheme } from "@components/Theme_Context";
import Tooltip from "@mui/material/Tooltip";
import useOutsideClick from "@hooks/useOutsideClick";
import AdminProfileModal from "@layout/Administrator_Profile";

const DashboardLayout = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const { selectedUser, userRole, userStatus } = useSelector(
    (state) => state.user
  );

  useOutsideClick(dropdownRef, () => setIsUserMenuOpen(false), isUserMenuOpen);

  useEffect(() => {
    const fetchData = async () => {
      if (!userRole.length && !userStatus.length) {
        await dispatch(fetchUserRoles());
        await dispatch(fetchUserStatuses());
      }
    };
    fetchData();
  }, [dispatch]);

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

  const handleOpenProfileModal = () => {
    if (selectedUser) {
      setOpenProfileModal(true);
    }
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setLoadingLogout(true);
    setTimeout(async () => {
      await dispatch(logout());
      await persistor.purge();
      window.location.replace("/homePage");
    }, 250);
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

  if (role === "Admin") {
    menuItems = menuItemsAdmin;
  } else if (role === "Staff") {
    menuItems = menuItemsStaff;
  }

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`flex flex-col h-full transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 p-2 shadow-xl overflow-hidden ${
          sidebarOpen ? "min-w-60 max-w-60" : "min-w-16 max-w-16"
        }`}
      >
        {/* Logo */}
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

        <hr className="border-gray-200 dark:border-gray-600 mb-2" />

        {/* Menu */}
        <nav className="flex-1 overflow-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            const button = (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full p-2 mb-1 rounded-lg transition-colors ${
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

        {/* Bottom Section */}
        <div
          className={`border-t border-gray-200 dark:border-gray-600 pt-2 ${
            sidebarOpen ? "space-y-1.5" : ""
          }`}
        >
          {/* User Info */}
          {selectedUser && (
            <div
              className={`flex items-center px-2 rounded-lg dark:hover:bg-gray-700 cursor-pointer transition-all ${
                sidebarOpen
                  ? "justify-between space-x-2 py-1.5"
                  : "flex-col space-y-1 justify-center"
              }`}
            >
              {sidebarOpen ? (
                <>
                  {/* Avatar + Info khi mở */}
                  <div className="flex items-center space-x-2">
                    <Avatar
                      name={selectedUser?.name}
                      avatarUrl={selectedUser?.avatar}
                      size={32}
                    />
                    <div className="flex flex-col">
                      {loadingLogout ? (
                        <div className="flex items-center space-x-2">
                          <svg
                            className="animate-spin h-4 w-4 text-blue-500"
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
                          <span className="text-sm text-blue-500">
                            Logging out...
                          </span>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-sm">
                            {selectedUser?.userName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-300">
                            {selectedUser?.email}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Nút Setting */}
                  <Tooltip title="View profile" placement="top">
                    <div className="pr-1.5 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProfileModal();
                        }}
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                      >
                        <SettingOutlined className="text-gray-600 dark:text-gray-300 text-xl" />
                      </button>
                    </div>
                  </Tooltip>
                </>
              ) : (
                <div>
                  {/* Khi sidebar đóng chỉ hiển thị nút Setting ở giữa */}
                  <Tooltip title="View profile" placement="right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProfileModal();
                      }}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <SettingOutlined className="text-gray-600 dark:text-gray-300 text-xl" />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          )}

          <AdminProfileModal
            isOpen={openProfileModal}
            onClose={() => setOpenProfileModal(false)}
            initialData={selectedUser}
            roleOptions={userRole}
            statusOptions={userStatus}
          />

          {/* Dark/Light Toggle */}
          <Tooltip
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            placement="right"
            arrow
            disableHoverListener={sidebarOpen}
          >
            <div
              className={`flex items-center px-2  ${
                sidebarOpen ? "justify-between py-1.5" : "justify-center"
              }`}
            >
              <div
                className={`flex items-center space-x-2 text-sm overflow-hidden transition-all duration-300 ease-in-out ${
                  sidebarOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                }`}
              >
                {darkMode ? (
                  <FiSun className="text-yellow-400 text-lg" />
                ) : (
                  <FiMoon className="text-xl" />
                )}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
              </label>
            </div>
          </Tooltip>

          {/* Logout */}
          <Tooltip
            title="Logout"
            placement="right"
            arrow
            disableHoverListener={sidebarOpen}
          >
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-2 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 text-red-600 ${
                sidebarOpen ? "justify-start " : "justify-center "
              }`}
            >
              <LogoutOutlined
                className={`text-xl ${sidebarOpen ? "" : "ml-1.5"}`}
              />
              <span
                className={`ml-2 overflow-hidden transition-all duration-300 ease-in-out ${
                  sidebarOpen ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                Logout
              </span>
            </button>
          </Tooltip>
        </div>
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
        </div>

        {/* Content */}
        <Outlet context={{ darkMode, userId: user?.userId }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
