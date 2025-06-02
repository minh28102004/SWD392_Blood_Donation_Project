import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaPlus,
  FaExclamationCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchUsers,
  fetchUserRoles,
  fetchUserStatuses,
  deleteUser,
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

const UserManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const { userList, userRole, userStatus, loading, error } = useSelector(
    (state) => state.user
  );
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Users
    dispatch(fetchUsers());
    dispatch(fetchUserRoles());
    dispatch(fetchUserStatuses());
    // BloodTypes, BloodComponents
    dispatch(fetchBloodComponents());
    dispatch(fetchBloodTypes());
  }, [dispatch]);

  useEffect(() => {
    setLoadingDelay(true);
    dispatch(fetchUsers());
    const timer = setTimeout(() => {
      setLoadingDelay(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Map role và status sang object để lookup nhanh
  const roleMap = userRole.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  const statusMap = userStatus.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  // Map userList với roleName và statusName
  const usersWithNames = userList.map((user) => ({
    ...user,
    roleName: roleMap[user.roleBit] || "N/A",
    statusName: statusMap[user.statusBit ? 1 : 0] || "N/A", // convert true/false => 1/0
  }));

  // Columns
  const columns = [
    { key: "identification", title: "Identification", width: "12%" },
    { key: "name", title: "Name", width: "15%" },
    { key: "email", title: "Email", width: "18%" },
    { key: "phone", title: "Phone", width: "10%" },
    {
      key: "dateOfBirth",
      title: "Date of Birth",
      width: "10%",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    { key: "address", title: "Address", width: "15%" },
    { key: "roleName", title: "Role", width: "8%" },
    {
      key: "statusName",
      title: "Status",
      width: "7%",
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
    setFormKey((prev) => prev + 1); // đổi key để reset form
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormKey((prev) => prev + 1); // đổi key để reset form
    setModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (user) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "( Note: The user will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteUser(user.userId)).unwrap();
          toast.success("User has been deleted!");
          dispatch(fetchUsers());
        } catch (error) {
          toast.error(
            error?.message || "An error occurred while deleting the user!"
          );
        }
      },
      style: { top: "30%" },
    });
  };

  const handleRefresh = () => {
    setLoadingDelay(true);
    dispatch(fetchUsers());
    const timer = setTimeout(() => {
      setLoadingDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  // Hiển thị badge màu cho status
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

  return (
    <div>
      <div
        className={`rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/*Table*/}
        <div className="p-2">
          {loading || loadingDelay ? (
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
        {/*Button*/}
        <ActionButtons
          loading={loading}
          loadingDelay={loadingDelay}
          onReload={handleRefresh}
          onCreate={handleCreateUser}
          createLabel="User"
        />
        {/*Modal*/}
        <UserCreationModal
          key={formKey}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedUser={selectedUser}
          onSuccess={() => dispatch(fetchUsers())}
          bloodTypes={bloodTypes} // thêm prop bloodTypes
          bloodComponents={bloodComponents} // thêm prop bloodComponents
        />
      </div>
    </div>
  );
};

export default UserManagement;
