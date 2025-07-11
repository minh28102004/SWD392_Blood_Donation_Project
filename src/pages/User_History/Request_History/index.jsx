import { useEffect, useState, useCallback } from "react";
import {FaExclamationCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBloodRequestsByUserId,
  deleteBloodRequest,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodRequestSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import ActionButtons from "@components/Action_Button";
import { toast } from "react-toastify";
import Pagination from "@components/Pagination";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";
import ViewDetailRequest from "./ViewDetail";
import { useDeleteWithConfirm } from "@hooks/useDeleteWithConfirm";
import CardItem from "@components/Card_Item/CardItem";

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

  const confirmDeleteBloodRequest = useDeleteWithConfirm(
    "skipDeleteBloodRequestConfirm",
    "Are you sure you want to cancel this request?",
    "Note: The blood request will be removed from the list"
  );

  const handleDelete = (request) => {
    confirmDeleteBloodRequest(async () => {
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
    });
  };

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
        .finally(() => stopLoading());
    }, 500);
  };

  const handleSearch = useCallback(
    (params) => {
      dispatch(setCurrentPage(1));
      setSearchParams(params);
    },
    [dispatch]
  );

  return (
    <div>
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
            placeholder: "Search blood component",
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

      <div className="px-4 pt-2 pb-4">
        {loading || isLoadingDelay ? (
          <LoadingSpinner color="blue" size="8" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : bloodRequestList.length === 0 ? (
          <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
            <FaExclamationCircle className="text-xl" />
            <p>No blood request applications have been found.</p>
          </div>
        ) : (
          <div className="max-h-[65vh] overflow-y-auto custom-scrollbar pr-2 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {bloodRequestList.map((item) => (
                <CardItem
                  key={item.bloodRequestId}
                  item={item}
                  onView={handleView}
                  onDelete={handleDelete}
                  type="request"
                />
              ))}
            </div>
          </div>
        )}
      </div>

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

      <ActionButtons
        loading={loading}
        loadingDelay={isLoadingDelay}
        onReload={handleRefresh}
      />

      <ViewDetailRequest
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedBR}
      />
    </div>
  );
};

export default RequestHistory;
