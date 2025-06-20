import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaNewspaper } from "react-icons/fa";
import { MdArticle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogPosts,
  setCurrentPage,
  setPageSize,
} from "@redux/features/blogPostsSlice";
import Pagination from "@components/Pagination";
import { baseURL } from "@services/api";
import LoadingSpinner from "@components/Loading";
import ErrorMessage from "@components/Error_Message";
import { useLoadingDelay } from "@hooks/useLoadingDelay";
import BlogPostDetailModal from "./blogPostDetail";

const Blog = () => {
  const [isLoadingDelay, startLoading, stopLoading] = useLoadingDelay(500);
  const dispatch = useDispatch();
  const componentKey = "blogPage";

  const { blogList, loading, error, pagination } = useSelector(
    (state) => state.blogPosts
  );

  const {
    currentPage = 1,
    pageSize = 9,
    totalCount = 0,
  } = pagination[componentKey] || {};

  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = useCallback((post) => {
    setSelectedPost(post);
    setModalOpen(true);
  }, []);

  const blogCards = useMemo(
    () =>
      blogList.map((post) => (
        <div
          key={post.postId}
          className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200"
        >
          <img
            src={`${baseURL}${post.imgPath}`}
            alt={post.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-white mb-4 line-clamp-3">
              {post.content?.slice(0, 100)}...
            </p>
            <button
              onClick={() => handleOpenModal(post)}
              className="text-white bg-gray-800 font-semibold px-4 py-2 rounded hover:text-yellow-500 hover:bg-gray-900 transition"
            >
              Read More →
            </button>
          </div>
        </div>
      )),
    [blogList, handleOpenModal]
  );

  useEffect(() => {
    let isMounted = true;
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
        console.error("Error fetching blog posts:", error);
      } finally {
        if (isMounted) stopLoading();
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [dispatch, currentPage, pageSize]);

  return (
    <section className="pt-16 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 pt-5">
        <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6 flex items-center justify-center gap-3">
          <FaNewspaper className="text-black dark:text-blue-300 text-2xl" />
          Latest Stories & Updates
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {loading || isLoadingDelay ? (
            <div className="col-span-3">
              <LoadingSpinner color="blue" size="8" />
            </div>
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">
              <ErrorMessage message={error} />
            </div>
          ) : blogList.length === 0 ? (
            <div className="col-span-3 flex justify-center items-center text-red-500 gap-2 text-lg">
              <MdArticle className="text-xl" />
              <p>No blog posts found.</p>
            </div>
          ) : (
            blogCards
          )}
        </div>

        <div className="mt-10">
          <Pagination
            totalCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={(page) => {
              dispatch(
                setCurrentPage({ key: componentKey, currentPage: page })
              );
            }}
            onPageSizeChange={(size) => {
              dispatch(setPageSize({ key: componentKey, pageSize: size }));
              dispatch(setCurrentPage({ key: componentKey, currentPage: 1 }));
            }}
          />
        </div>
      </div>

      <BlogPostDetailModal
        isOpen={modalOpen}
        post={selectedPost}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
};

export default Blog;
