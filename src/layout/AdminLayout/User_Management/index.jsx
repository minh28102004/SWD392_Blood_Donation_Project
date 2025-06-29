import { useEffect, useState, useCallback, useMemo } from "react";
import { FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchUsers,
  fetchUserRoles,
  fetchUserStatuses,
  deleteUser,
  setCurrentPage,
  setPageSize,
} from "@redux/features/userSlice";
import {
  fetchBloodComponents,
  fetchBloodTypes,
} from "@redux/features/bloodSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import UserCreationModal from "./Modal_User";
import { Modal } from "antd";
import { toast } from "react-toastify";
import Pagination from "@components/Pagination";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";

const UserManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const {
    userList,
    userRole,
    userStatus,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
  } = useSelector((state) => state.user);
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);
  const [searchParams, setSearchParams] = useState({
    name: "",
    role: "",
    statusBit: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(700);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          fetchUsers({ page: currentPage, size: pageSize, searchParams })
        );
        if (
          !bloodComponents.length &&
          !bloodTypes.length &&
          !userRole.length &&
          !userStatus.length
        ) {
          await dispatch(fetchBloodComponents());
          await dispatch(fetchBloodTypes());
          await dispatch(fetchUserRoles());
          await dispatch(fetchUserStatuses());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [dispatch, currentPage, pageSize, searchParams]);

  const usersWithNames = Array.isArray(userList)
    ? userList.map((user) => ({
        ...user,
        roleName: user.role?.name || "N/A",
        statusName: user.status?.name || "N/A",
      }))
    : [];

  const columns = [
    { key: "userId", title: "ID", width: "12%" },
    { key: "name", title: "Full Name", width: "20%" },
    { key: "email", title: "Email", width: "20%" },
    { key: "roleName", title: "Role", width: "15%" },
    {
      key: "statusName",
      title: "Status",
      width: "15%",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "actions",
      title: "Actions",
      width: "10%",
      render: (_, currentRow) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Edit user">
            <button
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transform transition-transform hover:scale-110"
              onClick={() => handleEdit(currentRow)}
              aria-label="Edit user"
            >
              <FaEdit size={20} />
            </button>
          </Tooltip>
          <Tooltip title="Delete user">
            <button
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 transform transition-transform hover:scale-110"
              onClick={() => handleDelete(currentRow)}
              aria-label="Delete user"
            >
              <FaTrash size={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  // [CREATE]
  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormKey((prev) => prev + 1); // Reset form
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormKey((prev) => prev + 1); // Reset form
    setModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (user) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "(Note: The user will be removed from the list)",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteUser(user.userId)).unwrap();
          toast.success("User has been deleted!");
          dispatch(
            fetchUsers({ page: currentPage, size: pageSize, searchParams })
          );
        } catch (error) {
          toast.error(
            error?.message || "An error occurred while deleting the user!"
          );
        }
      },
      style: { top: "30%" },
    });
  };

  // [REFRESH]
  const handleRefresh = () => {
    startLoading();
    setTimeout(() => {
      dispatch(fetchUsers({ page: currentPage, size: pageSize, searchParams }))
        .unwrap()
        .finally(() => {
          stopLoading();
        });
    }, 500);
  };

  // [SEARCH]
  const handleSearch = useCallback(
    (params) => {
      dispatch(setCurrentPage(1));
      setSearchParams(params);
    },
    [dispatch]
  );

  const getStatusBadge = (status) => {
    if (!status) return <span>N/A</span>;

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

  const roleOptions = useMemo(
    () => userRole.map((role) => ({ value: role.id, label: role.name })),
    [userRole]
  );
  const statusOptions = useMemo(
    () =>
      userStatus.map((status) => ({ value: status.id, label: status.name })),
    [userStatus]
  );

  return (
    <div>
      <div
        className={`rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Collapsible Search Component */}
        <CollapsibleSearch
          searchFields={[
            { key: "name", type: "text", placeholder: "Search By full name" },
            {
              key: "statusBit",
              type: "select",
              placeholder: "Search by status",
              options: statusOptions,
            },
            {
              key: "role",
              type: "select",
              placeholder: "Search by role",
              options: roleOptions,
            },
          ]}
          onSearch={handleSearch}
          onClear={() =>
            setSearchParams({
              name: "",
              statusBit: "",
              role: "",
            })
          }
        />
        {/* Table */}
        <div className="p-2">
          {loading || isLoadingDelay ? (
            <LoadingSpinner color="blue" size="8" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : userList.length === 0 ? (
            <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
              <FaExclamationCircle className="text-xl" />
              <p>No users found.</p>
            </div>
          ) : (
            <TableComponent columns={columns} data={usersWithNames} />
          )}
        </div>
        {/* Pagination */}
        <Pagination
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => {
            dispatch(setCurrentPage(page));
          }}
          onPageSizeChange={(size) => {
            dispatch(setPageSize(size));
            dispatch(setCurrentPage(1));
          }}
        />
        {/* Button */}
        <ActionButtons
          loading={loading}
          loadingDelay={isLoadingDelay}
          onReload={handleRefresh}
          onCreate={handleCreateUser}
          createLabel="User"
        />
        {/* Modal */}
        <UserCreationModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedUser={selectedUser}
          onSuccess={() =>
            dispatch(
              fetchUsers({ page: currentPage, size: pageSize, searchParams })
            )
          }
          bloodTypes={bloodTypes}
          bloodComponents={bloodComponents}
          userRole={userRole}
          userStatus={userStatus}
        />
      </div>
    </div>
  );
};

export default UserManagement;
