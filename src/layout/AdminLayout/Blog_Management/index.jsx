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
import BlogPostModal from "./modal_Blog";
import { Modal } from "antd";
import { toast } from "react-toastify";

const BlogPostManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const { blogList, loading, error } = useSelector((state) => state.blogPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formKey, setFormKey] = useState(0); // reset modal form key
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Columns tương ứng các field
  const columns = [
    { key: "postId", title: "ID", width: "6%" },
    {
      key: "imgPath",
      title: "Image",
      width: "10%",
      render: (value) =>
        value ? (
          <img
            src={value}
            alt="Post"
            className="max-h-12 max-w-16 object-cover rounded"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400 italic">No Image</span>
        ),
    },
    { key: "title", title: "Title", width: "20%" },
    {
      key: "content",
      title: "Content Preview",
      width: "20%",
      render: (value) => {
        if (!value) return "No content";
        const text = value.replace(/<[^>]+>/g, ""); // loại bỏ thẻ HTML
        return text.length > 80 ? text.slice(0, 77) + "..." : text;
      },
    },
    {
      key: "category",
      title: "Category",
      width: "10%",
      render: (value) => value || "N/A",
    },
    { key: "userName", title: "Author", width: "12%" },
    {
      key: "createdAt",
      title: "Created At",
      width: "10%",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      key: "updatedAt",
      title: "Updated At",
      width: "10%",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
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
              aria-label="Edit post"
            >
              <FaEdit size={20} />
            </button>
          </Tooltip>
          <Tooltip title="Delete post">
            <button
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 transform transition-transform hover:scale-110"
              onClick={() => handleDelete(currentRow)}
              aria-label="Delete post"
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
    setSelectedPost(null);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [EDIT]
  const handleEdit = (post) => {
    setSelectedPost(post);
    setFormKey((prev) => prev + 1); // reset form modal
    setModalOpen(true);
  };

  // [DELETE]
  const handleDelete = async (blog) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blog post?",
      content: "( Note: The blog post will be removed from the list )",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteBlogPost(blog.postId)).unwrap();
          toast.success("Blog post has been deleted!");
          dispatch(fetchBlogPosts());
        } catch (error) {
          toast.error(
            error?.message || "An error occurred while deleting the blog post!"
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
          ) : blogList.length === 0 ? (
            <div className="flex justify-center items-center text-red-500 gap-2 text-lg">
              <MdArticle className="text-xl" />
              <p>No blog posts found.</p>
            </div>
          ) : (
            <TableComponent columns={columns} data={blogList} />
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
        <BlogPostModal
          key={formKey} // reset modal mỗi lần mở
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedPost={selectedPost}
          onSuccess={() => dispatch(fetchBlogPosts())}
        />
      </div>
    </div>
  );
};

export default BlogPostManagement;
