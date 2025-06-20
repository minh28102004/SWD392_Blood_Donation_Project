import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  fetchBlogPosts,
  deleteBlogPost,
  setCurrentPage,
  setPageSize,
} from "@redux/features/blogPostsSlice";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import TableComponent from "@components/Table";
import ActionButtons from "@components/Action_Button";
import Tooltip from "@mui/material/Tooltip";
import BlogPostModal from "./modal_Blog";
import { Modal } from "antd";
import { toast } from "react-toastify";
import Pagination from "@components/Pagination";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import CollapsibleSearch from "@components/Collapsible_Search";
import { baseURL } from "@services/api";

const BlogPostManagement = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const { blogList, loading, error, pagination } = useSelector(
    (state) => state.blogPosts
  );
  const componentKey = "blogmanage";
  const {
    currentPage = 1,
    pageSize = 6,
    totalCount = 0,
    totalPages = 0,
  } = pagination[componentKey] || {};
  const [searchParams, setSearchParams] = useState({
    id: "",
    title: "",
  });

  const [selectedPost, setSelectedPost] = useState(null);
  const [formKey, setFormKey] = useState(0); // reset modal form key
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(700);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        await dispatch(
          fetchBlogPosts({
            key: componentKey,
            page: currentPage,
            size: pageSize,
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

  const columns = [
    { key: "postId", title: "ID", width: "6%", className: "text-center" },
    {
      key: "imgPath",
      title: "Image",
      width: "15%",
      className: "text-center",
      render: (value) =>
        value ? (
          <div className="relative group cursor-pointer flex justify-center">
            <img
              src={`${baseURL}${value}`}
              alt="Post"
              className="h-20 w-20 object-cover rounded shadow-md cursor-pointer"
              onClick={() => handleImageZoom(`${baseURL}${value}`)}
              loading="lazy"
            />
            <div
              className="w-20 absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex justify-center items-center text-white text-lg font-normal transition duration-200"
              style={{ pointerEvents: "none" }}
            >
              <FaEye size={18} />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center text-gray-400 italic">
            No Image
          </div>
        ),
    },
    { key: "title", title: "Title", width: "20%", className: "text-center" },
    {
      key: "content",
      title: "Content Preview",
      width: "20%",
      className: "text-center",
      render: (value) => {
        if (!value) return "No content";
        const text = value.replace(/<[^>]+>/g, "");
        return text.length > 80 ? text.slice(0, 77) + "..." : text;
      },
    },
    {
      key: "category",
      title: "Category",
      width: "10%",
      className: "text-center",
      render: (value) => value || "N/A",
    },
    {
      key: "userName",
      title: "Author",
      width: "12%",
      className: "text-center",
    },
    {
      key: "createdAt",
      title: "Created At",
      width: "10%",
      className: "text-center",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      key: "updatedAt",
      title: "Updated At",
      width: "10%",
      className: "text-center",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      key: "actions",
      title: "Actions",
      width: "12%",
      className: "text-center",
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
          dispatch(
            fetchBlogPosts({ page: currentPage, size: pageSize, searchParams })
          );
        } catch (error) {
          toast.error(
            error?.message || "An error occurred while deleting the blog post!"
          );
        }
      },
      style: { top: "30%" },
    });
  };

  // [REFRESH]
  const handleRefresh = () => {
    startLoading();
    setTimeout(() => {
      dispatch(
        fetchBlogPosts({ page: currentPage, size: pageSize, searchParams })
      )
        .unwrap()
        .finally(() => {
          stopLoading();
        });
    }, 1000);
  };

  // [SEARCH]
  const handleSearch = useCallback(
    (params) => {
      dispatch(setCurrentPage(1));
      setSearchParams(params);
    },
    [dispatch]
  );

  const handleImageZoom = (image) => {
    setZoomedImage(image);
    setIsImageZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsImageZoomed(false);
  };

  return (
    <div>
      <div
        className={`rounded-lg shadow-md transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Collapsible Search Component */}
        <CollapsibleSearch
          searchFields={[
            { key: "id", type: "text", placeholder: "Search By Id" },
            { key: "title", type: "text", placeholder: "Search By Title" },
          ]}
          onSearch={handleSearch}
          onClear={() =>
            setSearchParams({
              id: "",
              title: "",
            })
          }
        />
        <div className="p-2">
          {loading || isLoadingDelay ? (
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
        {/* Pagination */}
        <Pagination
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => {
            dispatch(setCurrentPage({ key: componentKey, currentPage: page }));
          }}
          onPageSizeChange={(size) => {
            dispatch(setPageSize({ key: componentKey, pageSize: size }));
            dispatch(setCurrentPage({ key: componentKey, currentPage: 1 }));
          }}
        />
        {/*Button*/}
        <ActionButtons
          loading={loading}
          loadingDelay={isLoadingDelay}
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
          onSuccess={() =>
            dispatch(
              fetchBlogPosts({
                page: currentPage,
                size: pageSize,
                searchParams,
              })
            )
          }
        />
        {/*Image zoom*/}
        {isImageZoomed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
            onClick={handleCloseZoom}
          >
            <img
              src={zoomedImage}
              alt="Zoomed Preview"
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostManagement;
