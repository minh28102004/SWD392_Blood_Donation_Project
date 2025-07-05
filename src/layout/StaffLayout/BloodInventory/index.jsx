import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchBloodInventories,
  createBloodInventory,
  updateBloodInventory,
  deleteBloodInventory,
  setCurrentPage,
  setPageSize,
} from "@redux/features/bloodInvSlice";
import Pagination from "@components/Pagination";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import InventoryModal from "./modal_Inventory";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";
const BloodInventoryManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const { bloodList, loading, error, totalCount, currentPage, pageSize } =
    useSelector((state) => state.bloodInventory);
  const [searchParams, setSearchParams] = useState({
    inventoryId: "",
    bloodComponentId: "",
    bloodTypeId: "",
  });

  const [selectedInventory, setSelectedInventory] = useState(null);
  const [formKey, setFormKey] = useState(0); // reset modal form key
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(1000);

  // Columns tương ứng các field
  const columns = [
    { key: "inventoryId", title: "Inventory ID", width: "15%" },
    { key: "bloodTypeName", title: "Blood Type Name", width: "20%" },
    { key: "bloodComponentName", title: "Blood Component Name", width: "20%" },
    { key: "quantity", title: "Quantity", width: "10%" },
    { key: "unit", title: "Unit", width: "10%" },
    {
      key: "lastUpdated",
      title: "Last Updated",
      width: "15%",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = `${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
        return formattedDate;
      },
    },
    { key: "inventoryLocation", title: "Location", width: "10%" },
    {
      key: "actions",
      title: "Actions",
      width: "12%",
      render: (_, currentRow) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Edit Inventory">
            <button
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transform transition-transform hover:scale-110"
              onClick={() => handleEdit(currentRow)}
              aria-label="Edit Inventory"
            >
              <FaEdit size={20} />
            </button>
          </Tooltip>
          <Tooltip title="Delete Inventory">
            <button
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 transform transition-transform hover:scale-110"
              onClick={() => handleDelete(currentRow)}
              aria-label="Delete Inventory"
            >
              <FaTrash size={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          fetchBloodInventories({
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

  // [CREATE] CreateInventory
  const handleCreateInventory = () => {
    setSelectedInventory(null);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (inventory) => {
    setSelectedInventory(inventory);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
    console.log("Editing inventory:", inventory);
  };

  // [DELETE]
  const handleDelete = async (bloodInv) => {
    Modal.confirm({
      title: "Are you sure you want to delete this inventory?",
      content: "( Note: The inventory will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteBloodInventory(bloodInv.inventoryId)).unwrap();
          toast.success("Blood inventory has been deleted!");
          dispatch(
            fetchBloodInventories({
              page: currentPage,
              size: pageSize,
              searchParams,
            })
          );
        } catch (error) {
          toast.error(
            error?.message ||
              "An error occurred while deleting the blood inventory!"
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
      setSearchParams(params);
    },
    [dispatch]
  );
  // [REFRESH]
  const handleRefresh = () => {
    startLoading();
    setTimeout(() => {
      dispatch(
        fetchBloodInventories({
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
            { key: "id", type: "text", placeholder: "Search By Id" },
            {
              key: "bloodType",
              type: "text",
              placeholder: "Search By BloodType",
            },
            {
              key: "bloodComponent",
              type: "text",
              placeholder: "Search By Blood Component",
            },
          ]}
          onSearch={handleSearch}
          onClear={() =>
            setSearchParams({
              id: "",
              bloodType: "",
              bloodComponent: "",
            })
          }
        />
        <div className="p-2">
          {loading || isLoadingDelay ? (
            <LoadingSpinner color="blue" size="8" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : bloodList.length === 0 ? (
            <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
              <MdArticle className="text-xl" />
              <p>No blood inventories found.</p>
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={bloodList.slice(
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
          onCreate={handleCreateInventory}
          createLabel="Inventory"
        />
        {/*Modal*/}
        <InventoryModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedInventory={selectedInventory}
          onSuccess={() =>
            dispatch(
              fetchBloodInventories({
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

export default BloodInventoryManagement;
