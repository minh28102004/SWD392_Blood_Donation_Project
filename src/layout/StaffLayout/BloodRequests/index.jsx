import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchBloodRequests,
  updateBloodRequest,
  fetchBloodRequestById,
} from "@redux/features/bloodRequestSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import { Checkbox } from "@mui/material";

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

  useEffect(() => {
    setLoadingDelay(true);
    dispatch(fetchBloodRequests({ page: currentPage, size: pageSize }))
      .unwrap()
      .catch((err) => console.error("Fetch failed:", err))
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  }, [dispatch, currentPage, pageSize]);

  const handleToggleStatus = async (row) => {
    const newStatus = row.status.id === 0 ? 1 : 0; // Pending <-> Fulfilled
    const formData = new FormData();
    formData.append("bloodRequestId", row.bloodRequestId);
    formData.append("status.id", newStatus);
    try {
      await dispatch(updateBloodRequest({ id: row.bloodRequestId, formData })).unwrap();
      toast.success("Status updated!");
      dispatch(fetchBloodRequests({ page: currentPage, size: pageSize }));
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleShowDetail = async (row) => {
    try {
      const res = await dispatch(fetchBloodRequestById(row.bloodRequestId)).unwrap();
      setSelectedDetail(res);
      setDetailModalVisible(true);
    } catch (error) {
      toast.error("Failed to load detail.");
    }
  };

  const columns = [
    { key: "bloodRequestId", title: "Blood ID", width: "6%" },
    { key: "name", title: "Name", width: "12%" },
    { key: "bloodTypeName", title: "Blood Type", width: "10%" },
    { key: "bloodComponentName", title: "Component", width: "12%" },
    { key: "quantity", title: "Qty", width: "8%" },
    { key: "isEmergency", title: "Emergency", width: "10%", render: (v) => <Checkbox checked={v} /> },
    { key: "status", title: "Status", width: "10%", render: (s) => s.name },
    {
      key: "actions",
      title: "Actions",
      width: "18%",
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="Toggle Status">
            <Button
              type="primary"
              size="small"
              onClick={() => handleToggleStatus(row)}
            >
              Toggle Status
            </Button>
          </Tooltip>
          <Tooltip title="View Detail">
            <Button
              type="default"
              size="small"
              onClick={() => handleShowDetail(row)}
            >
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
