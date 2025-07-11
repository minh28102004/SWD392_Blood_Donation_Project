import { useEffect, useState, useCallback } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDonationRequestsByUserId,
  deleteDonationRequest,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodDonationSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import ActionButtons from "@components/Action_Button";
import { toast } from "react-toastify";
import Pagination from "@components/Pagination";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";
import ViewDetailDonation from "./ViewDetail";
import { useDeleteWithConfirm } from "@hooks/useDeleteWithConfirm";
import CardItem from "@components/Card_Item/CardItem";

const DonationHistory = ({ user, bloodType, bloodComponent }) => {
  const dispatch = useDispatch();
  const { donationList, loading, error, totalCount, currentPage, pageSize } =
    useSelector((state) => state.donationRequests);
  const [searchParams, setSearchParams] = useState({
    bloodTypeId: "",
    bloodComponentId: "",
    status: "",
    preferredDate: "",
  });
  const [selectedBD, setSelectedBD] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(1000);

  const handleView = (currentRow) => {
    setSelectedBD(currentRow);
    setIsViewModalOpen(true);
  };

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

  const confirmDeleteDonationRequest = useDeleteWithConfirm(
    "skipDeleteDonationRequestConfirm",
    "Are you sure you want to delete this request?",
    "Note: The donation request will be removed from the list"
  );

  const handleDelete = (request) => {
    confirmDeleteDonationRequest(async () => {
      await dispatch(deleteDonationRequest(request.donateRequestId)).unwrap();
      toast.success("Request has been deleted!");
      dispatch(
        fetchDonationRequestsByUserId({
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
            key: "BloodTypeId",
            type: "select",
            placeholder: "Search by blood type",
            options: bloodType,
          },
          {
            key: "BloodComponentId",
            type: "select",
            placeholder: "Search blood component",
            options: bloodComponent,
          },
          {
            key: "preferredDate",
            type: "date",
            placeholder: "Date prefer",
          },
          {
            key: "status",
            type: "select",
            placeholder: "Search by Status",
            options: [
              { value: "Pending", label: "Pending" },
              { value: "Successful", label: "Successful" },
              { value: "Cancelled", label: "Cancelled" },
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

      <div className="px-4 pt-2 pb-4">
        {loading || isLoadingDelay ? (
          <LoadingSpinner color="blue" size="8" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : donationList.length === 0 ? (
          <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
            <FaExclamationCircle className="text-xl" />
            <p>No blood donation requests have been found.</p>
          </div>
        ) : (
          <div className="max-h-[65vh] overflow-y-auto custom-scrollbar pr-2 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {donationList.map((item) => (
                <CardItem
                  key={item.donateRequestId}
                  item={item}
                  onView={handleView}
                  onDelete={handleDelete}
                  type="donation"
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

      <ViewDetailDonation
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={selectedBD}
      />

   
    </div>
  );
};

export default DonationHistory;
