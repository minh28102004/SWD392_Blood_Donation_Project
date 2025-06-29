import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaExclamationCircle, FaEye, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBloodRequestsByUserId,
  updateBloodRequest,
  deleteBloodRequest,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodRequestSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import { Modal } from "antd";
import { toast } from "react-toastify";
import Pagination from "@components/Pagination";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";
import ViewDetailRequest from "./ViewDetail";
import RequestCreationModal from "./EditModal";

const RequestHistory = ({ user, bloodType, bloodComponent }) => {
  const dispatch = useDispatch();
  const {
    bloodRequestList,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
  } = useSelector((state) => state.bloodRequest);
  const [searchParams, setSearchParams] = useState({
    bloodTypeId: "",
    bloodComponentId: "",
    isEmergency: "",
    status: "",
  });
  const [selectedBR, setSelectedBR] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(1000);

  const handleView = (currentRow) => {
    setSelectedBR(currentRow);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    if (!user?.userId) return;

    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          fetchBloodRequestsByUserId({
            userId: user.userId,
            page: currentPage,
            size: pageSize,
            searchParams,
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [dispatch, currentPage, pageSize, searchParams, user]);

  const columns = [
    { key: "bloodRequestId", title: "Blood Request ID", width: "12%" },
    { key: "bloodTypeName", title: "Blood Type", width: "10%" },
    { key: "bloodComponentName", title: "Blood Component", width: "15%" },
    {
      key: "isEmergency",
      title: "Emergency",
      width: "10%",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "quantity",
      title: "Quantity (ml)",
      width: "10%",
    },
    {
      key: "createdAt",
      title: "Created At",
      width: "15%",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status",
      title: "Status",
      width: "10%",
      render: (value) => {
        const statusName = value?.name || "N/A";
        return (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              statusName.toLowerCase() === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {statusName}
          </span>
        );
      },
    },
    { key: "location", title: "Location", width: "13%" },
    {
      key: "actions",
      title: "Actions",
      width: "10%",
      render: (_, currentRow) => (
        <div className="flex justify-center gap-1">
          <Tooltip title="View detail request">
            <button
              className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-500 transform transition-transform hover:scale-110"
              onClick={() => handleView(currentRow)}
            >
              <FaEye size={20} />
            </button>
          </Tooltip>

          {/* Chỉ hiển thị nút Edit nếu status là "Pending" */}
          {currentRow?.status?.name?.toLowerCase() === "pending" && (
            <Tooltip title="Edit request field">
              <button
                className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transform transition-transform hover:scale-110"
                onClick={() => handleEdit(currentRow)}
              >
                <FaEdit size={20} />
              </button>
            </Tooltip>
          )}

          <Tooltip title="Cancel request send">
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

  // [EDIT]
  const handleEdit = (value) => {
    setSelectedBR(value);
    setFormKey((prev) => prev + 1); // reset form
    setIsEditModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (request) => {
    Modal.confirm({
      title: "Are you sure you want to cancel this request?",
      content: "(Note: The blood request will be removed from the list)",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteBloodRequest(request.bloodRequestId)).unwrap();
          toast.success("Request has been deleted!");
          dispatch(
            fetchBloodRequestsByUserId({
              userId: user.userId,
              page: currentPage,
              size: pageSize,
              searchParams,
            })
          );
        } catch (error) {
          toast.error(
            error?.message || "An error occurred while deleting the request!"
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
      dispatch(
        fetchBloodRequestsByUserId({
          userId: user.userId,
          page: currentPage,
          size: pageSize,
          searchParams,
        })
      )
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

  return (
    <div>
      {/* Collapsible Search Component */}
      <CollapsibleSearch
        searchFields={[
          {
            key: "bloodTypeId",
            type: "select",
            placeholder: "Search by blood type",
            options: bloodType,
          },
          {
            key: "bloodComponentId",
            type: "select",
            placeholder: "Search by blood component",
            options: bloodComponent,
          },
          {
            key: "isEmergency",
            type: "select",
            placeholder: "Search by Emergency status",
            options: [
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ],
          },
          {
            key: "status",
            type: "select",
            placeholder: "Search by Status",
            options: [
              { value: "0", label: "Pending" },
              { value: "1", label: "Successful" },
              { value: "2", label: "Cancelled" },
            ],
          },
        ]}
        onSearch={handleSearch}
        onClear={() =>
          setSearchParams({
            bloodTypeId: "",
            bloodComponentId: "",
            isEmergency: "",
            status: "",
          })
        }
      />
      {/* Table */}
      <div className="p-2">
        {loading || isLoadingDelay ? (
          <LoadingSpinner color="blue" size="8" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : bloodRequestList.length === 0 ? (
          <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
            <FaExclamationCircle className="text-xl" />
            <p>No blood request applications have been submitted yet.</p>
          </div>
        ) : (
          <TableComponent columns={columns} data={bloodRequestList} />
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
      />{" "}
      {/* View Request Detail */}
      {isViewModalOpen && (
        <ViewDetailRequest
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={selectedBR}
        />
      )}
      {/* Edit Request Modal */}
      {isEditModalOpen && selectedBR && (
        <RequestCreationModal
          key={formKey}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          selectedRequest={selectedBR}
          onSuccess={() => {
            handleRefresh();
            setIsEditModalOpen(false);
          }}
          bloodTypeList={bloodType}
          bloodComponentList={bloodComponent}
          statusList={[
            { id: 0, name: "Pending" },
            { id: 1, name: "Successful" },
            { id: 2, name: "Cancelled" },
          ]}
        />
      )}
    </div>
  );
};

export default RequestHistory;
