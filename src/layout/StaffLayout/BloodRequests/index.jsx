import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@components/Pagination";
import { useOutletContext } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import ActionButtons from "@components/Action_Button";
import {
  fetchBloodRequests,
  updateBloodRequestStatus,
  fetchBloodRequestById,
  setCurrentPage,
} from "@redux/features/bloodRequestSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal, Select } from "antd";
import { toast } from "react-toastify";
import { Checkbox } from "@mui/material";
import CollapsibleSearch from "@components/Collapsible_Search";
import {
  fetchBloodComponents,
  fetchBloodTypes,
} from "@redux/features/bloodSlice";
import { Tag, Dropdown, Menu } from "antd";

const statusOptions = [
  { id: 0, label: "Pending" },
  { id: 1, label: "Successful" },
  { id: 2, label: "Cancel" },
];

const BloodRequests = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();

  const {
    bloodRequestList,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
  } = useSelector((state) => state.bloodRequest);
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    bloodTypeId: "",
    bloodComponentId: "",
    isEmergency: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchBloodTypes());
    dispatch(fetchBloodComponents());
  }, [dispatch]);

  useEffect(() => {
    setLoadingDelay(true);
    dispatch(
      fetchBloodRequests({ page: currentPage, size: pageSize, searchParams })
    )
      .unwrap()
      .catch((err) => console.error("Fetch failed:", err))
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  }, [dispatch, currentPage, pageSize, searchParams]);

  const handleStatusChange = async (value, row) => {
    try {
      await dispatch(
        updateBloodRequestStatus({
          id: row.bloodRequestId,
          status: value,
        })
      ).unwrap();

      toast.success("Status updated!");

      await dispatch(
        fetchBloodRequests({
          page: currentPage,
          size: pageSize,
          searchParams,
        })
      ).unwrap(); //
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status.");
    }
  };

  const handleShowDetail = async (row) => {
    try {
      const res = await dispatch(
        fetchBloodRequestById(row.bloodRequestId)
      ).unwrap();
      setSelectedDetail(res);
      setDetailModalVisible(true);
    } catch {
      toast.error("Failed to load detail.");
    }
  };

  const handleSearch = useCallback(
    (params) => {
      // Chuyển các trường sang đúng kiểu dữ liệu
      const parsedParams = {
        keyword: params.keyword || "",
        bloodTypeId: params.bloodTypeId ? parseInt(params.bloodTypeId) : "",
        bloodComponentId: params.bloodComponentId
          ? parseInt(params.bloodComponentId)
          : "",
        isEmergency:
          params.isEmergency === ""
            ? ""
            : params.isEmergency === "true" || params.isEmergency === true,
        status: params.status !== "" ? parseInt(params.status) : "",
      };

      dispatch(setCurrentPage(1));
      setSearchParams(parsedParams);
    },
    [dispatch]
  );

  const handleRefresh = () => {
    setLoadingDelay(true);
    dispatch(
      fetchBloodRequests({ page: currentPage, size: pageSize, searchParams })
    )
      .unwrap()
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  };

  const columns = [
    { key: "bloodRequestId", title: "Blood ID", width: "6%" },
    { key: "name", title: "Name", width: "12%" },
    { key: "bloodTypeName", title: "Blood Type", width: "7%" },
    { key: "bloodComponentName", title: "Component", width: "12%" },
    { key: "quantity", title: "Quantity", width: "8%" },
    {
      key: "isEmergency",
      title: "Emergency",
      width: "10%",
      render: (v) => <Checkbox checked={v} disabled />,
    },
    {
      key: "status",
      title: "Status",
      width: "10%",
      render: (_, row) => {
        const statusColorMap = {
          0: "gold",
          1: "green",
          2: "red",
        };

        const statusLabelMap = {
          0: "Pending",
          1: "Successful",
          2: "Cancelled",
        };

        const handleStatusConfirm = (newStatus) => {
          if (newStatus === row.status.id) return;

          Modal.confirm({
            title: "Confirm Status Update",
            content: (
              <span>
                Are you sure you want to update the status of this blood request
                to{" "}
                <span
                  style={{
                    color: statusColorMap[newStatus],
                    fontWeight: "semibold",
                    textTransform: "capitalize",
                  }}
                >
                  {statusLabelMap[newStatus]}
                </span>
                ?
              </span>
            ),
            okText: "Confirm",
            cancelText: "Cancel",
            onOk: () => handleStatusChange(newStatus, row),
            centered: false,
            style: { top: "30%" },
          });
        };

        const menu = (
          <Menu>
            {statusOptions.map((opt) => (
              <Menu.Item
                key={opt.id}
                onClick={() => handleStatusConfirm(opt.id)}
                disabled={opt.id === row.status.id}
              >
                {opt.label}
              </Menu.Item>
            ))}
          </Menu>
        );

        const tagElement = (
          <Tag
            color={statusColorMap[row.status.id]}
            className={
              row.status.id === 0 ? "cursor-pointer font-medium" : "font-medium"
            }
          >
            {statusLabelMap[row.status.id]}
          </Tag>
        );

        return row.status.id === 0 ? (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Tooltip title="Update status">{tagElement}</Tooltip>
          </Dropdown>
        ) : (
          tagElement
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "5%",
      render: (_, row) => (
        <Tooltip title="View detail request">
          <button
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-500"
            onClick={() => handleShowDetail(row)}
          >
            <FaEye size={18} />
          </button>
        </Tooltip>
      ),
    },
  ];

  const bloodTypeOptions = bloodTypes.map((bt) => ({
    value: bt.bloodTypeId.toString(),
    label: `${bt.name}${bt.rhFactor}`,
  }));

  const bloodComponentOptions = bloodComponents.map((bc) => ({
    value: bc.bloodComponentId.toString(),
    label: bc.name,
  }));

  return (
    <div>
      <div
        className={`rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Search */}
        <CollapsibleSearch
          searchFields={[
            {
              key: "keyword",
              type: "text",
              placeholder: "Search by keyword (e.g. name, phone...)",
            },
            {
              key: "bloodTypeId",
              type: "select",
              options: bloodTypeOptions,
              placeholder: "Select Blood Type",
            },
            {
              key: "bloodComponentId",
              type: "select",
              options: bloodComponentOptions,
              placeholder: "Select Blood Component",
            },
            {
              key: "isEmergency",
              type: "select",
              options: [
                { value: "", label: "All" },
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ],
              placeholder: "Emergency?",
            },
            {
              key: "status",
              type: "select",
              options: [
                { value: "", label: "All" },
                { value: 0, label: "Pending" },
                { value: 1, label: "Successful" },
                { value: 2, label: "Cancel" },
              ],
              placeholder: "Status",
            },
          ]}
          onSearch={handleSearch}
          onClear={() =>
            setSearchParams({
              keyword: "",
              bloodTypeId: "",
              bloodComponentId: "",
              isEmergency: "",
              status: "",
            })
          }
        />

        <div className="p-2">
          {loading || loadingDelay ? (
            <LoadingSpinner color="blue" size="8" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : bloodRequestList.length === 0 ? (
            <div className="text-center text-red-500">
              No blood requests found.
            </div>
          ) : (
            <TableComponent columns={columns} data={bloodRequestList} />
          )}
        </div>
        {/*Pagination*/}
        <Pagination
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
          onPageSizeChange={(size) => {
            dispatch(setPageSize(size));
            dispatch(setCurrentPage(1));
          }}
        />
        <ActionButtons
          loading={loading}
          loadingDelay={loadingDelay}
          onReload={handleRefresh}
        />
      </div>

      {/* Modal for Detail */}
      <Modal
        title={
          <div className="text-center text-2xl font-semibold">
            Blood Request Detail
            {selectedDetail ? ` - [${selectedDetail.bloodRequestId}]` : ""}
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedDetail && (
          <div className="space-y-6 text-sm">
            {/* Info section */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                👤 Personal Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <strong>Name:</strong> {selectedDetail.name}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedDetail.phone}
                </div>
                <div>
                  <strong>Date of Birth:</strong> {selectedDetail.dateOfBirth}
                </div>
              </div>
            </div>

            {/* Request section */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                🩸 Request Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <strong>Blood Type:</strong> {selectedDetail.bloodTypeName}
                </div>
                <div>
                  <strong>Component:</strong>{" "}
                  {selectedDetail.bloodComponentName}
                </div>
                <div>
                  <strong>Quantity:</strong> {selectedDetail.quantity}
                </div>
                <div>
                  <strong>Emergency:</strong>{" "}
                  <span
                    className={
                      selectedDetail.isEmergency
                        ? "text-red-500 font-semibold"
                        : "text-green-600"
                    }
                  >
                    {selectedDetail.isEmergency ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedDetail.status.id === 0
                        ? "text-yellow-600"
                        : selectedDetail.status.id === 1
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {selectedDetail.status.name}
                  </span>
                </div>
                <div>
                  <strong>Fulfilled:</strong>{" "}
                  {selectedDetail.fulfilled ? "Yes" : "No"}
                </div>
              </div>
            </div>

            {/* Health & Location */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                📍 Health & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <strong>Height:</strong> {selectedDetail.heightCm} cm
                </div>
                <div>
                  <strong>Weight:</strong> {selectedDetail.weightKg} kg
                </div>
                <div className="md:col-span-2">
                  <strong>Location:</strong> {selectedDetail.location}
                </div>
                <div className="md:col-span-2">
                  <strong>Health Info:</strong> {selectedDetail.healthInfo}
                </div>
              </div>
            </div>

            {/* Time */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                🕒 Timestamp
              </h3>
              <div>{new Date(selectedDetail.createdAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BloodRequests;
