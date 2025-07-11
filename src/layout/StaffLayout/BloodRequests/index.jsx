import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
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
import { fetchAllBloodTypes } from "@redux/features/bloodTypeSlice";
import { fetchBloodComponents } from "@redux/features/bloodComponentSlice";

const { Option } = Select;

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
  } = useSelector((state) => state.bloodRequest);

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
const bloodTypes = useSelector((state) => state.bloodType.bloodTypeList || []);
const bloodComponents = useSelector((state) => state.bloodComponent.bloodComponentList || []);

useEffect(() => {
  dispatch(fetchAllBloodTypes()); // ✅ GỌI đúng thunk
  dispatch(fetchBloodComponents());
}, [dispatch]);



  useEffect(() => {
    setLoadingDelay(true);
    dispatch(fetchBloodRequests({ page: currentPage, size: pageSize, searchParams }))
      .unwrap()
      .catch((err) => console.error("Fetch failed:", err))
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  }, [dispatch, currentPage, pageSize, searchParams]);

const handleStatusChange = async (value, row) => {
  try {
    await dispatch(updateBloodRequestStatus({
      id: row.bloodRequestId,
      status: value
    })).unwrap();

    toast.success("Status updated!");

    await dispatch(fetchBloodRequests({
      page: currentPage,
      size: pageSize,
      searchParams
    })).unwrap(); //

  } catch (err) {
    console.error("Update failed:", err);
    toast.error("Failed to update status.");
  }
};


  const handleShowDetail = async (row) => {
    try {
      const res = await dispatch(fetchBloodRequestById(row.bloodRequestId)).unwrap();
      setSelectedDetail(res);
      setDetailModalVisible(true);
    } catch {
      toast.error("Failed to load detail.");
    }
  };

const handleSearch = useCallback((params) => {
  // Chuyển các trường sang đúng kiểu dữ liệu
  const parsedParams = {
    keyword: params.keyword || "",
    bloodTypeId: params.bloodTypeId ? parseInt(params.bloodTypeId) : "",
    bloodComponentId: params.bloodComponentId ? parseInt(params.bloodComponentId) : "",
    isEmergency: params.isEmergency === "" ? "" : params.isEmergency === "true" || params.isEmergency === true,
    status: params.status !== "" ? parseInt(params.status) : "",
  };

  dispatch(setCurrentPage(1));
  setSearchParams(parsedParams);
}, [dispatch]);

  const handleRefresh = () => {
    setLoadingDelay(true);
    dispatch(fetchBloodRequests({ page: currentPage, size: pageSize, searchParams }))
      .unwrap()
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  };

  const columns = [
    { key: "bloodRequestId", title: "Blood ID", width: "6%" },
    { key: "name", title: "Name", width: "12%" },
    { key: "bloodTypeName", title: "Blood Type", width: "10%" },
    { key: "bloodComponentName", title: "Component", width: "12%" },
    { key: "quantity", title: "Qty", width: "8%" },
    {
      key: "isEmergency",
      title: "Emergency",
      width: "10%",
      render: (v) => <Checkbox checked={v} disabled />,
    },
    {
      key: "status",
      title: "Status",
      width: "15%",
      render: (_, row) => (
        <Select
          value={row.status.id}
          onChange={(val) => handleStatusChange(val, row)}
          size="small"
          style={{ width: "100%" }}
        >
          {statusOptions.map((opt) => (
            <Option key={opt.id} value={opt.id}>
              {opt.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "12%",
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="View Detail">
            <Button type="default" size="small" onClick={() => handleShowDetail(row)}>
              Detail
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={`rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        {/* Search */}
<CollapsibleSearch
  searchFields={[
    { key: "keyword", type: "text", placeholder: "Search by keyword (e.g. name, phone...)" },
    {
      key: "bloodTypeId",
      type: "select",
      options: [
        { value: "", label: "All" },
        ...bloodTypes.map((bt) => ({ value: bt.id, label: bt.name })),
      ],
      placeholder: "Select Blood Type",
    },
    {
      key: "bloodComponentId",
      type: "select",
      options: [
        { value: "", label: "All" },
        ...bloodComponents.map((bc) => ({ value: bc.id, label: bc.name })),
      ],
      placeholder: "Select Component",
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
            <div className="text-center text-red-500">No blood requests found.</div>
          ) : (
            <TableComponent columns={columns} data={bloodRequestList} />
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end px-4 pb-4">
          <Button onClick={handleRefresh} loading={loading || loadingDelay}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Modal for Detail */}
      <Modal
        title="Blood Request Detail"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        {selectedDetail && (
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {selectedDetail.bloodRequestId}</p>
            <p><strong>Name:</strong> {selectedDetail.name}</p>
            <p><strong>User ID:</strong> {selectedDetail.userId}</p>
            <p><strong>Phone:</strong> {selectedDetail.phone}</p>
            <p><strong>Blood Type:</strong> {selectedDetail.bloodTypeName}</p>
            <p><strong>Component:</strong> {selectedDetail.bloodComponentName}</p>
            <p><strong>Emergency:</strong> {selectedDetail.isEmergency ? "Yes" : "No"}</p>
            <p><strong>Quantity:</strong> {selectedDetail.quantity}</p>
            <p><strong>Location:</strong> {selectedDetail.location}</p>
            <p><strong>Status:</strong> {selectedDetail.status.name}</p>
            <p><strong>Fulfilled:</strong> {selectedDetail.fulfilled ? "Yes" : "No"}</p>
            <p><strong>Health Info:</strong> {selectedDetail.healthInfo}</p>
            <p><strong>Height:</strong> {selectedDetail.heightCm} cm</p>
            <p><strong>Weight:</strong> {selectedDetail.weightKg} kg</p>
            <p><strong>Date of Birth:</strong> {selectedDetail.dateOfBirth}</p>
            <p><strong>Created At:</strong> {new Date(selectedDetail.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BloodRequests;
