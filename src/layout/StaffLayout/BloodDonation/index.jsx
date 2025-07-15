import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import ActionButtons from "@components/Action_Button";
import { FaEye } from "react-icons/fa";
import {
  searchDonationRequests,
  updateBloodDonationStatus,
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
import Tooltip from "@mui/material/Tooltip";
import { Button, Modal, Select } from "antd";
import { toast } from "react-toastify";
import CollapsibleSearch from "@components/Collapsible_Search";
import Pagination from "@components/Pagination";
import { Tag, Dropdown, Menu } from "antd";

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
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);
  const [searchParams, setSearchParams] = useState({});
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    dispatch(fetchBloodTypes());
    dispatch(fetchBloodComponents());
  }, [dispatch]);

  useEffect(() => {
    setLoadingDelay(true);
    dispatch(
      searchDonationRequests({
        page: currentPage,
        size: pageSize,
        filters: searchParams,
      })
    )
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
      dispatch(
        searchDonationRequests({
          page: currentPage,
          size: pageSize,
          filters: searchParams,
        })
      );
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status.");
    }
  };

  const handleShowDetail = (row) => {
    setSelectedDetail(row);
    setDetailModalVisible(true);
  };

  const handleSearch = useCallback(
    (params) => {
      const parsedParams = {
        keyword: params.keyword || undefined,
        bloodTypeId: params.bloodTypeId
          ? parseInt(params.bloodTypeId)
          : undefined,
        bloodComponentId: params.bloodComponentId
          ? parseInt(params.bloodComponentId)
          : undefined,
        status: params.status !== "" ? parseInt(params.status) : undefined,
      };

      dispatch(setCurrentPage(1));
      setSearchParams(parsedParams);
    },
    [dispatch]
  );

  const handleRefresh = () => {
    setLoadingDelay(true);
    dispatch(
      searchDonationRequests({
        page: currentPage,
        size: pageSize,
        filters: searchParams,
      })
    )
      .unwrap()
      .finally(() => setTimeout(() => setLoadingDelay(false), 800));
  };

  const columns = [
    { key: "donateRequestId", title: "Donation ID", width: "6%" },
    { key: "name", title: "Name", width: "12%" },
    {
      key: "bloodType",
      title: "Blood Type",
      width: "7%",
      render: (val) => (val ? `${val.name}${val.rhFactor}` : "N/A"),
    },
    {
      key: "bloodComponent",
      title: "Blood Component",
      width: "10%",
      render: (val) => val?.name || "N/A",
    },

    { key: "quantity", title: "Quantity (ml)", width: "10%" },
    {
      key: "preferredDate",
      title: "Preferred Date",
      width: "10%",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "N/A"),
    },
    {
      key: "status",
      title: "Status",
      width: "7%",
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

        const menu = (
          <Menu
            onClick={({ key }) => handleStatusChange(parseInt(key), row)}
            items={statusOptions.map((opt) => ({
              key: opt.id,
              label: opt.label,
            }))}
          />
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Tag
              color={statusColorMap[row.status]}
              className="cursor-pointer font-medium"
            >
              {statusLabelMap[row.status] || "Unknown"}
            </Tag>
          </Dropdown>
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
        <CollapsibleSearch
          searchFields={[
            {
              key: "keyword",
              type: "text",
              placeholder: "Search by keyword (userId, location...)",
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
              placeholder: "Select Component",
            },
            {
              key: "status",
              type: "select",
              options: [
                { value: "", label: "All Status" },
                ...statusOptions.map((opt) => ({
                  value: opt.id,
                  label: opt.label,
                })),
              ],
              placeholder: "Select Status",
            },
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

      <Modal
        title={
          <div className="text-center text-2xl font-semibold">
            Dơnation Request Detail
            {selectedDetail ? ` - [${selectedDetail.donateRequestId}]` : ""}
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
                <div className="md:col-span-2">
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(selectedDetail.dateOfBirth).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Donation section */}
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                🩸 Donation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <strong>Blood Type:</strong>{" "}
                  {selectedDetail.bloodType
                    ? `${selectedDetail.bloodType.name}${selectedDetail.bloodType.rhFactor}`
                    : "N/A"}
                </div>
                <div>
                  <strong>Component:</strong>{" "}
                  {selectedDetail.bloodComponent?.name || "N/A"}
                </div>

                <div>
                  <strong>Quantity:</strong> {selectedDetail.quantity} ml
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedDetail.status === 0
                        ? "text-yellow-600"
                        : selectedDetail.status === 1
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {statusOptions.find((s) => s.id === selectedDetail.status)
                      ?.label || "Unknown"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <strong>Preferred Date:</strong>{" "}
                  {new Date(selectedDetail.preferredDate).toLocaleDateString()}
                </div>
                <div className="md:col-span-2">
                  <strong>Last Donation:</strong>{" "}
                  {new Date(
                    selectedDetail.lastDonationDate
                  ).toLocaleDateString()}
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

export default BloodDonation;
