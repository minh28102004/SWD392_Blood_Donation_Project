import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaExclamationCircle, FaEye, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDonationRequestsByUserId,
  updateDonationRequest,
  deleteDonationRequest,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodDonationSlice";
import {
  fetchBloodComponents,
  fetchBloodTypes,
} from "@redux/features/bloodSlice";
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

const DonationHistory = ({ user, bloodType, bloodComponent }) => {
  const dispatch = useDispatch();
  const { donationList, loading, error, totalCount, currentPage, pageSize } =
    useSelector((state) => state.donationRequests);
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);
  const [searchParams, setSearchParams] = useState({
    bloodTypeId: "",
    bloodComponentId: "",
    UrgencyLevel: "",
    status: "",
  });
  const [selectedBD, setSelectedBD] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(1000);

  const bloodTypeOptions = bloodTypes.map((bt) => ({
    value: bt.bloodTypeId.toString(),
    label: `${bt.name}${bt.rhFactor}`,
  }));

  const bloodComponentOptions = bloodComponents.map((bc) => ({
    value: bc.bloodComponentId.toString(),
    label: bc.name,
  }));

  useEffect(() => {
    if (!user?.userId) return;

    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          fetchDonationRequestsByUserId({
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
    { key: "donateRequestId", title: "Donation Request ID", width: "15%" },
    // { key: "userName", title: "User Name", width: "20%" },
    // { key: "bloodTypeName", title: "Blood Type", width: "15%" },
    { key: "quantity", title: "Quantity", width: "10%" },
    {
      key: "status",
      title: "Status",
      width: "10%",
      render: (value) => {
        return (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              value === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      title: "Created At",
      width: "20%",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    { key: "location", title: "Location", width: "20%" },
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
          <Tooltip title="Edit request field">
            <button
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transform transition-transform hover:scale-110"
              onClick={() => handleEdit(currentRow)}
            >
              <FaEdit size={20} />
            </button>
          </Tooltip>
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
    setSelectedBD(value);
    setFormKey((prev) => prev + 1); // Reset form
    setModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (request) => {
    Modal.confirm({
      title: "Are you sure you want to delete this request?",
      content: "(Note: The donation request will be removed from the list)",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(
            deleteDonationRequest(request.donateRequestId)
          ).unwrap();
          toast.success("Request has been deleted!");
          dispatch(
            fetchDonationRequestsByUserId({
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
        fetchDonationRequestsByUserId({
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
            key: "BloodTypeId",
            type: "select",
            placeholder: "Search by blood type",
            options: bloodType,
          },
          {
            key: "BloodComponentId",
            type: "select",
            placeholder: "Search by blood component",
            options: bloodComponent,
          },
          {
            key: "UrgencyLevel",
            type: "select",
            placeholder: "Search by urgencyLevel",
            options: bloodComponent,
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
            UrgencyLevel: "",
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
        ) : donationList.length === 0 ? (
          <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
            <FaExclamationCircle className="text-xl" />
            <p>No blood donation requests have been submitted yet.</p>
          </div>
        ) : (
          <TableComponent columns={columns} data={donationList} />
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
      />
    </div>
  );
};

export default DonationHistory;
