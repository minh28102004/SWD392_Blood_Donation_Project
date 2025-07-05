import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchBloodTypes,
  createBloodType,
  updateBloodType,
  deleteBloodType,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodTypeSlice";
import Pagination from "@components/Pagination";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import BloodTypeModal from "./modal_BloodType";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";
import { bloodTypes } from "@pages/HomePage/About_blood/blood_Data";
const BloodTypeManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const { bloodTypeList, loading, error, totalCount, currentPage, pageSize } =
    useSelector((state) => state.bloodType);
  const [searchParams, setSearchParams] = useState({
    bloodTypeId: "",
    name: "",
    rhFactor: "",
  });

  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [formKey, setFormKey] = useState(0); // reset modal form key
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(1000);

  // Columns tương ứng các field

  const columns = [
    { key: "bloodTypeId", title: "Blood Type ID", width: "15%" },
    { key: "name", title: "Name", width: "20%" },
    { key: "rhFactor", title: "Rh Factor", width: "20%" },
    {
      key: "actions",
      title: "Actions",
      width: "12%",
      render: (_, currentRow) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Edit post">
            <button
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transform transition-transform hover:scale-110"
              onClick={() => handleEdit(currentRow)}
              aria-label="Edit Blood Type"
            >
              <FaEdit size={20} />
            </button>
          </Tooltip>
          <Tooltip title="Delete Blood Type">
            <button
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 transform transition-transform hover:scale-110"
              onClick={() => handleDelete(currentRow)}
              aria-label="Delete Blood Type"
            >
              <FaTrash size={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
  useEffect(() => {
    console.log("FETCHED BLOOD TYPES:", bloodTypeList);
    console.log("SEARCH PARAMS:", searchParams);
  }, [bloodTypeList, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          fetchBloodTypes({
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
  }, [dispatch, currentPage, pageSize, searchParams]);

  // [CREATE]
  const handleCreateBloodType = () => {
    setSelectedBloodType(null);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (bloodType) => {
    setSelectedBloodType(bloodType);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
    console.log("Editing blood type:", bloodType);
  };

  // [DELETE]
  const handleDelete = async (bloodType) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blood type?",
      content: "( Note: The blood type will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteBloodType(bloodType.bloodTypeId)).unwrap();
          toast.success("Blood type has been deleted!");
          dispatch(
            fetchBloodTypes({
              page: currentPage,
              size: pageSize,
              searchParams,
            })
          );
        } catch (error) {
          toast.error(
            error?.message || "An error occurred while deleting the blood type!"
          );
        }
      },
      style: { top: "30%" },
    });
  };
  //[SEARCH]
  const handleSearch = useCallback(
    (params) => {
      dispatch(setCurrentPage(1));
      setSearchParams(params); // OK
    },
    [dispatch]
  );

  // [REFRESH]
  const handleRefresh = () => {
    startLoading();
    setTimeout(() => {
      dispatch(
        fetchBloodTypes({
          page: currentPage,
          size: pageSize,
          searchParams,
        })
      )
        .unwrap()
        .finally(() => {
          stopLoading();
        });
    }, 1000);
  };

  return (
    <div>
      <div
        className={`rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <CollapsibleSearch
          searchFields={[
            { key: "bloodTypeId", type: "text", placeholder: "Search By Id" },
            { key: "name", type: "text", placeholder: "Search By Blood Type" },
            {
              key: "rhFactor",
              type: "text",
              placeholder: "Search By Rh Factor (+ or -)",
            },
          ]}
          onSearch={handleSearch}
          onClear={() =>
            setSearchParams({
              bloodTypeId: "",
              name: "",
              rhFactor: "",
            })
          }
        />
        <div className="p-2">
          {loading || isLoadingDelay ? (
            <LoadingSpinner color="blue" size="8" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : bloodTypeList.length === 0 ? (
            <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
              <MdArticle className="text-xl" />
              <p>No blood types found.</p>
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={bloodTypeList.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
            />
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
        {/*Button*/}
        <ActionButtons
          loading={loading}
          loadingDelay={isLoadingDelay}
          onReload={handleRefresh}
          onCreate={handleCreateBloodType}
          createLabel="Blood Type"
        />
        {/*Modal*/}
        <BloodTypeModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedBloodType={selectedBloodType}
          onSuccess={() =>
            dispatch(
              fetchBloodTypes({
                page: currentPage,
                size: 5,
                searchParams,
              })
            )
          }
        />
      </div>
    </div>
  );
};

export default BloodTypeManagement;
