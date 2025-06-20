import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDonationRequests,
  deleteDonationRequest,
  createDonationRequest,
  updateDonationRequest,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodDonationSlice";
import { FaEdit, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { Modal } from "antd";
import { toast } from "react-toastify";

import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Pagination from "@components/Pagination";
import CollapsibleSearch from "@components/Collapsible_Search";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import DonationModal from "./DonationModal";

const BloodDonation = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();

  const {
    donationList,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
  } = useSelector((state) => state.donationRequests);

  const [searchParams, setSearchParams] = useState({
    status: "",
    location: "",
  });

  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(1000);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      await dispatch(
        fetchDonationRequests({
          page: currentPage,
          size: pageSize,
          searchParams,
        })
      );
      stopLoading();
    };
    fetchData();
  }, [dispatch, currentPage, pageSize, searchParams]);

  const handleDelete = async (row) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this donation request?",
      onOk: async () => {
        try {
          await dispatch(deleteDonationRequest(row.donateRequestId)).unwrap();
          toast.success("Deleted successfully!");
          dispatch(
            fetchDonationRequests({
              page: currentPage,
              size: pageSize,
              searchParams,
            })
          );
        } catch {
          toast.error("Delete failed!");
        }
      },
      okText: "Yes",
      cancelText: "No",
      centered: true,
    });
  };

  const handleEdit = (row) => {
    setSelectedRequest(row);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRequest(null);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    startLoading();
    setTimeout(() => {
      dispatch(
        fetchDonationRequests({
          page: currentPage,
          size: pageSize,
          searchParams,
        })
      );
      stopLoading();
    }, 1000);
  };

  const handleSearch = useCallback(
    (params) => {
      dispatch(setCurrentPage(1));
      setSearchParams(params);
    },
    [dispatch]
  );

  const handleSubmitModal = async (formData) => {
    try {
      if (selectedRequest) {
        await dispatch(updateDonationRequest(formData)).unwrap();
        toast.success("Donation request updated successfully!");
      } else {
        await dispatch(createDonationRequest(formData)).unwrap();
        toast.success("Donation request created successfully!");
      }

      setModalOpen(false);
      dispatch(
        fetchDonationRequests({
          page: currentPage,
          size: pageSize,
          searchParams,
        })
      );
    } catch (err) {
      toast.error("Failed to submit donation request");
      console.error(err);
    }
  };

  const columns = [
    { key: "donateRequestId", title: "ID", width: "5%" },
    { key: "location", title: "Location", width: "15%" },
    {
      key: "preferredDate",
      title: "Preferred Date",
      width: "12%",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    { key: "quantity", title: "Quantity (ml)", width: "10%" },
    { key: "status", title: "Status", width: "10%" },
    { key: "note", title: "Note", width: "20%" },
    {
      key: "actions",
      title: "Actions",
      width: "10%",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Edit">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(row)}
            >
              <FaEdit />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(row)}
            >
              <FaTrash />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`rounded-lg shadow-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <CollapsibleSearch
        searchFields={[
          { key: "status", type: "text", placeholder: "Search by status" },
          { key: "location", type: "text", placeholder: "Search by location" },
        ]}
        onSearch={handleSearch}
        onClear={() => setSearchParams({ status: "", location: "" })}
      />

      <div className="p-2">
        {loading || isLoadingDelay ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : donationList.length === 0 ? (
          <div className="text-center text-red-500 text-lg flex justify-center items-center gap-2">
            <FaExclamationCircle /> No donation requests found.
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
        onReload={handleRefresh}
        createLabel="Donation"
        onCreate={handleCreate}
      />

      <DonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedRequest={selectedRequest}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};

export default BloodDonation;
