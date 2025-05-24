import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { fetchUsers } from "@redux/features/userSlice";
import LoadingSpinner from "@components/Loading_Component";
import ErrorMessage from "@components/Error_Message_Component";
import TableComponent from "@components/Table_Component";

const UserManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const { userList, loading, error } = useSelector((state) => state.user);
  const [loadingDelay, setLoadingDelay] = useState(true);

  const columns = [
    { key: "identification", title: "Identification" },
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Phone" },
    {
      key: "dateOfBirth",
      title: "Date of Birth",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    { key: "role", title: "Role" },
    { key: "address", title: "Address" },
    {
      key: "status",
      title: "Status",
      render: (value) => getStatusBadge(value),
    },
  ];

  useEffect(() => {
    setLoadingDelay(true);
    dispatch(fetchUsers());
    const timer = setTimeout(() => {
      setLoadingDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleRefresh = () => {
    setLoadingDelay(true);
    dispatch(fetchUsers());
    const timer = setTimeout(() => {
      setLoadingDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  const getStatusBadge = (status) => {
    const isActive = status.toLowerCase() === "active";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <div
        className={`rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="p-2">
          {loading || loadingDelay ? (
            <LoadingSpinner color="blue" size="8" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : userList.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <TableComponent
              columns={columns}
              data={userList}
              darkMode={darkMode}
            />
          )}
        </div>
        <div className="flex justify-between items-center px-4 py-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
