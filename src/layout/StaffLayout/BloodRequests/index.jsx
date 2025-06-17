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
import { deleteBloodRequest } from "@redux/features/bloodRequestSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import RequestModal from "./modal_Request";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { Checkbox } from "@mui/material";
const request = [
  {
    id: 1,
    blood_request_id: "1",
    user_id: 1,
    blood_type_id: "A",
    blood_component: "fake component",
    quantity_unit: 300,
    is_emergency: true,
  },
  {
    id: 2,
    blood_request_id: "2",
    user_id: 2,
    blood_type_id: "A+",
    blood_component: "fake component",
    quantity_unit: 400,
    is_emergency: false,
  },
];
const BloodRequests = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const [selectedRquest, setSelectedRequest] = useState(null);
  const [formKey, setFormKey] = useState(0); // reset modal form key
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const error = undefined;

  // Columns tương ứng các field
  const columns = [
    { key: "blood_request_id", title: "BloodID", width: "6%" },

    { key: "user_id", title: "UserId", width: "20%" },
    { key: "blood_type_id", title: "BloodType", width: "20%" },
    { key: "blood_component", title: "BloodCompId", width: "20%" },
    { key: "quantity_unit", title: "QuantityUnit", width: "20%" },
    {
      key: "is_emergency",
      title: "Emergency",
      width: "20%",
      render: (value) => {
        return <Checkbox checked={value} />;
      },
    },

    {
      key: "actions",
      title: "Actions",
      width: "12%",
      render: (_, currentRow) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Edit request">
            <button
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transform transition-transform hover:scale-110"
              onClick={() => handleEdit(currentRow)}
              aria-label="Edit request"
            >
              <FaEdit size={20} />
            </button>
          </Tooltip>
          <Tooltip title="Delete request">
            <button
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 transform transition-transform hover:scale-110"
              onClick={() => handleDelete(currentRow)}
              aria-label="Delete request"
            >
              <FaTrash size={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
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
    setSelectedRequest(null);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (request) => {
    setSelectedRequest(request);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (blog) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blood request?",
      content: "( Note: The Blood request will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteBloodRequest(request.id)).unwrap();
          toast.success("Blood request has been deleted!");
          dispatch(fetchBlogPosts());
        } catch (error) {
          toast.error(
            error?.message ||
              "An error occurred while deleting the blood request!"
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
          ) : request.length === 0 ? (
            <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
              <MdArticle className="text-xl" />
              <p>No Blood requests found.</p>
            </div>
          ) : (
            <TableComponent columns={columns} data={request} />
          )}
        </div>
        {/*Button*/}
        <ActionButtons
          loading={loading}
          loadingDelay={loadingDelay}
          onReload={handleRefresh}
          onCreate={handleCreatePost}
          createLabel="Request"
        />
        {/*Modal*/}
        <RequestModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedRquest={selectedRquest}
          onSuccess={() => dispatch(fetchBlogPosts())}
        />
      </div>
    </div>
  );
};

export default BloodRequests;
