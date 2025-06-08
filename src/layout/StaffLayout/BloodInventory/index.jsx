import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@redux/features/blogPostsSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import InventoryModal from "./modal_Inventory";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { Checkbox } from "@mui/material";
const inventory = [
  {
    IntId: 1,
    blood_request_id: "1",
    blood_type_id: "A",
    last_update: "12/2/2025",
    quantity_unit: 300,
    location: "HCM City",
  },
  {
    IntId: 2,
    blood_request_id: "2",
    blood_type_id: "B",
    last_update: "12/3/2025",
    quantity_unit: 400,
    location: "HaNoi",
  },
];
const BloodRequests = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const [selectedRequest, setselectedRequest] = useState(null);
  const [formKey, setFormKey] = useState(0); // reset modal form key
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const error = undefined;

  // Columns tương ứng các field
  const columns = [
    { key: "IntId", title: "Inventory ID", width: "20%" },
    { key: "blood_type_id", title: "Blood Type", width: "20%" },
    { key: "quantity_unit", title: "Quantity Unit", width: "20%" },
    { key: "last_update", title: "Last Updated", width: "20%" },
    { key: "location", title: "Location", width: "20%" },
  ];

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  useEffect(() => {
    setLoadingDelay(true);
    dispatch(fetchBlogPosts());
    const timer = setTimeout(() => {
      setLoadingDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // [CREATE]
  const handleCreatePost = () => {
    setselectedRequest(null);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (post) => {
    setselectedRequest(post);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (blog) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blood inventory?",
      content: "( Note: The blood inventory will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteBlogPost(blog.postId)).unwrap();
          toast.success("Blood inventory has been deleted!");
          dispatch(fetchBlogPosts());
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
    setLoadingDelay(true);
    dispatch(fetchBlogPosts());
    const timer = setTimeout(() => {
      setLoadingDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  return (
    <div>
      <div
        className={`rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="p-2">
          {loading || loadingDelay ? (
            <LoadingSpinner color="blue" size="8" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : inventory.length === 0 ? (
            <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
              <MdArticle className="text-xl" />
              <p>No blood inventorys found.</p>
            </div>
          ) : (
            <TableComponent columns={columns} data={inventory} />
          )}
        </div>
        {/*Button*/}
        <ActionButtons
          loading={loading}
          loadingDelay={loadingDelay}
          onReload={handleRefresh}
          onCreate={handleCreatePost}
          createLabel="Post"
        />
        {/*Modal*/}
        <InventoryModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedRequest={selectedRequest}
          onSuccess={() => dispatch(fetchBlogPosts())}
        />
      </div>
    </div>
  );
};

export default BloodRequests;
