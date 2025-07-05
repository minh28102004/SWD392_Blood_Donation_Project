import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchBloodComponents,
  createBloodComponent,
  updateBloodComponent,
  deleteBloodComponent,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodComponentSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import BloodComponentModal from "./modal_BloodComponent";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";
import Pagination from "@components/Pagination";

const BloodComponentManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const {
    bloodComponentList,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
  } = useSelector((state) => state.bloodComponent);
  const [searchParams, setSearchParams] = useState({
    bloodComponentId: "",
    name: "",
  });

  const [selectedBloodComponent, setSelectedBloodComponent] = useState(null);
  const [formKey, setFormKey] = useState(0); // reset modal form key
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(1000);

  // Columns tương ứng các field

  const columns = [
    { key: "name", title: "Name", width: "20%" },

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
          <Tooltip title="Delete Blood Component">
            <button
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 transform transition-transform hover:scale-110"
              onClick={() => handleDelete(currentRow)}
              aria-label="Delete Blood Component"
            >
              <FaTrash size={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
  useEffect(() => {
    console.log("FETCHED Blood Component:", bloodComponentList);
    console.log("SEARCH PARAMS:", searchParams);
  }, [bloodComponentList, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          fetchBloodComponents({
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
  const handleCreateBloodComponent = () => {
    setSelectedBloodComponent(null);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (bloodComponent) => {
    setSelectedBloodComponent(bloodComponent);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
    console.log("Editing blood Component:", bloodComponent);
  };

  // [DELETE]
  const handleDelete = async (bloodComponent) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blood component?",
      content: "( Note: The blood component will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(
            deleteBloodComponent(bloodComponent.bloodComponentId)
          ).unwrap();
          toast.success("Blood Component has been deleted!");
          dispatch(
            fetchBloodComponents({
              page: currentPage,
              size: pageSize,
              searchParams,
            })
          );
        } catch (error) {
          toast.error(
            error?.message ||
              "An error occurred while deleting the blood Component!"
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
        fetchBloodComponents({
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
            {
              key: "bloodComponentId",
              type: "text",
              placeholder: "Search By Id",
            },
            {
              key: "name",
              type: "text",
              placeholder: "Search By Blood Component",
            },
          ]}
          onSearch={handleSearch}
          onClear={() =>
            setSearchParams({
              bloodComponentId: "",
              name: "",
            })
          }
        />
        <div className="p-2">
          {loading || isLoadingDelay ? (
            <LoadingSpinner color="blue" size="8" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : bloodComponentList.length === 0 ? (
            <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
              <MdArticle className="text-xl" />
              <p>No blood components found.</p>
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={bloodComponentList.slice(
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
          onCreate={handleCreateBloodComponent}
          createLabel="Blood Component"
        />
        {/*Modal*/}
        <BloodComponentModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedBloodComponent={selectedBloodComponent}
          onSuccess={() =>
            dispatch(
              fetchBloodComponents({
                page: currentPage,
                size: pageSize,
                searchParams,
              })
            )
          }
        />
      </div>
    </div>
  );
};

export default BloodComponentManagement;
