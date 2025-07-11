import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import ActionButtons from "@components/Action_Button";
import {
  searchDonationRequests,
  updateBloodDonationStatus,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodDonationSlice";
import { fetchAllBloodTypes } from "@redux/features/bloodTypeSlice";
import { fetchBloodComponents } from "@redux/features/bloodComponentSlice";

import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal, Select } from "antd";
import { toast } from "react-toastify";
import CollapsibleSearch from "@components/Collapsible_Search";
import Pagination from "@components/Pagination";

const { Option } = Select;

const statusOptions = [
  { id: 0, label: "Pending" },
  { id: 1, label: "Successful" },
  { id: 2, label: "Cancel" },
];

const BloodDonation = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();

  const { donationList, loading, error, totalCount, currentPage, pageSize } =
    useSelector((state) => state.donationRequests);

  const bloodTypes = useSelector((state) => state.bloodType.bloodTypeList || []);
  const bloodComponents = useSelector((state) => state.bloodComponent.bloodComponentList || []);

  const [searchParams, setSearchParams] = useState({});
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBloodTypes());
    dispatch(fetchBloodComponents());
  }, [dispatch]);

  const getBloodTypeName = (id) => {
    const item = bloodTypes.find(bt => bt.id === id);
    return item ? item.name : `ID ${id}`;
  };

  const getBloodComponentName = (id) => {
    const item = bloodComponents.find(bc => bc.id === id);
    return item ? item.name : `ID ${id}`;
  };

  useEffect(() => {
    setLoadingDelay(true);
    dispatch(searchDonationRequests({ page: currentPage, size: pageSize, filters: searchParams }))
      .unwrap()
      .catch((err) => console.error("Search failed:", err))
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  }, [dispatch, currentPage, pageSize, searchParams]);

  const handleStatusChange = async (value, row) => {
    try {
      await dispatch(
        updateBloodDonationStatus({ id: row.donateRequestId, status: value })
      ).unwrap();
      toast.success("Status updated!");
      dispatch(searchDonationRequests({ page: currentPage, size: pageSize, filters: searchParams }));
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status.");
    }
  };

  const handleShowDetail = (row) => {
    setSelectedDetail(row);
    setDetailModalVisible(true);
  };

  const handleSearch = useCallback((params) => {
    const parsedParams = {
      keyword: params.keyword || undefined,
      bloodTypeId: params.bloodTypeId ? parseInt(params.bloodTypeId) : undefined,
      bloodComponentId: params.bloodComponentId ? parseInt(params.bloodComponentId) : undefined,
      status: params.status !== "" ? parseInt(params.status) : undefined,
    };

    dispatch(setCurrentPage(1));
    setSearchParams(parsedParams);
  }, [dispatch]);

  const handleRefresh = () => {
    setLoadingDelay(true);
    dispatch(searchDonationRequests({ page: currentPage, size: pageSize, filters: searchParams }))
      .unwrap()
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  };

  const columns = [
    { key: "donateRequestId", title: "Donation ID", width: "6%" },
    { key: "location", title: "Location", width: "12%" },
    {
      key: "preferredDate",
      title: "Preferred Date",
      width: "12%",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "N/A"),
    },
    { key: "quantity", title: "Quantity (ml)", width: "10%" },
    {
      key: "status",
      title: "Status",
      width: "15%",
      render: (_, row) => (
        <Select
          value={row.status}
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
        <CollapsibleSearch
          searchFields={[
            { key: "keyword", type: "text", placeholder: "Search by keyword (userId, location...)" },
            {
              key: "bloodTypeId",
              type: "select",
              options: [
                { value: "", label: "All Blood Types" },
                ...bloodTypes.map(bt => ({ value: bt.id, label: bt.name }))
              ],
              placeholder: "Select Blood Type"
            },
            {
              key: "bloodComponentId",
              type: "select",
              options: [
                { value: "", label: "All Components" },
                ...bloodComponents.map(bc => ({ value: bc.id, label: bc.name }))
              ],
              placeholder: "Select Component"
            },
            {
              key: "status",
              type: "select",
              options: [
                { value: "", label: "All Status" },
                ...statusOptions.map(opt => ({ value: opt.id, label: opt.label }))
              ],
              placeholder: "Select Status"
            }
          ]}
          onSearch={handleSearch}
          onClear={() => {
            dispatch(setCurrentPage(1));
            setSearchParams({});
          }}
        />

        <div className="p-2">
          {loading || loadingDelay ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : donationList.length === 0 ? (
            <div className="text-center text-red-500">
              No donation requests found.
            </div>
          ) : (
            <TableComponent columns={columns} data={donationList} />
          )}
        </div>

        <div className="flex justify-end px-4 pb-4">
          <Button onClick={handleRefresh} loading={loading || loadingDelay}>
            Refresh
          </Button>
        </div>
      </div>

      <Modal
        title="Donation Request Detail"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        {selectedDetail && (
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {selectedDetail.donateRequestId}</p>
            <p><strong>User ID:</strong> {selectedDetail.userId}</p>
            <p><strong>Blood Type:</strong> {getBloodTypeName(selectedDetail.bloodTypeId)}</p>
            <p><strong>Blood Component:</strong> {getBloodComponentName(selectedDetail.bloodComponentId)}</p>
            <p><strong>Preferred Date:</strong> {new Date(selectedDetail.preferredDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {selectedDetail.location}</p>
            <p><strong>Created At:</strong> {new Date(selectedDetail.createdAt).toLocaleString()}</p>
            <p><strong>Quantity:</strong> {selectedDetail.quantity} ml</p>
            <p><strong>Height:</strong> {selectedDetail.heightCm} cm</p>
            <p><strong>Weight:</strong> {selectedDetail.weightKg} kg</p>
            <p><strong>Last Donation Date:</strong> {new Date(selectedDetail.lastDonationDate).toLocaleDateString()}</p>
            <p><strong>Health Info:</strong> {selectedDetail.healthInfo}</p>
            <p><strong>Date of Birth:</strong> {new Date(selectedDetail.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {statusOptions.find(s => s.id === selectedDetail.status)?.label}</p>
          </div>
        )}
      </Modal>

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
    </div>
  );
};

export default BloodDonation;
