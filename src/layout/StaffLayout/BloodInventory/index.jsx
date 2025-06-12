import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchBloodInventories,
  createBloodInventory,
  updateBloodInventory,
  deleteBloodInventory,
} from "@redux/features/bloodInvSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import InventoryModal from "./modal_Inventory";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { Checkbox } from "@mui/material";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
const BloodInventoryManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const {  bloodList, loading, error, totalCount, currentPage, pageSize } =
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
    { key: "inventoryId", title: "Inventory ID", width: "20%" },
    { key: "bloodTypeId", title: "Blood Type", width: "20%" },
    { key: "bloodTypeName", title: "Blood Type Name", width: "20%" },
    { key: "bloodComponentId", title: "Blood Component", width: "20%" },
    { key: "bloodComponentName", title: "Blood Component Name", width: "20%" },
    { key: "quantity", title: "Quantity", width: "20%" },
    { key: "unit", title: "unit", width: "20%" },
    { key: "lastUpdated", title: "Last Updated", width: "20%" },
    { key: "inventoryLocation", title: "Location", width: "20%" },
  ];

 useEffect(() => {
     const fetchData = async () => {
       startLoading();
       try {
         await dispatch(
           fetchBloodInventories({ page: currentPage, size: pageSize, searchParams })
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
  const handleCreatePost = () => {
    setSelectedInventory(null);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (post) => {
    setSelectedInventory(post);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (inventory) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blood inventory?",
      content: "( Note: The blood inventory will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteBloodInventory(inventory.inventoryId)).unwrap();
          toast.success("Blood inventory has been deleted!");
          dispatch(fetchBloodInventories());
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

 const handleRefresh = () => {
     startLoading();
     setTimeout(() => {
       dispatch(
         fetchBloodInventories({ page: currentPage, size: pageSize, searchParams })
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
            <TableComponent columns={columns} data={bloodList} />
          )}
        </div>
        {/*Button*/}
        <ActionButtons
          loading={loading}
          loadingDelay={isLoadingDelay}
          onReload={handleRefresh}
          onCreate={handleCreatePost}
          createLabel="Inventory"
        />
        {/*Modal*/}
        <InventoryModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedInventory={selectedInventory}
          onSuccess={() => dispatch(fetchBloodInventories())}
        />
      </div>
    </div>
  );
};

export default BloodInventoryManagement;
