import React, { Fragment, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes, FaShare, FaClock, FaBookmark } from "react-icons/fa";
import { format } from "date-fns";
import { baseURL } from "@services/API/api";

const BlogPostDetailModal = ({ isOpen, onClose, post }) => {
  const panelRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (panelRef.current) {
        const el = panelRef.current;
        setIsScrollable(el.scrollHeight > el.clientHeight);
      }
    };
    const timeout = setTimeout(checkScroll, 10);
    return () => clearTimeout(timeout);
  }, [post, isOpen]);

  if (!post) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-65" />

        {/* Modal content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center py-8 px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel
                ref={panelRef}
                className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-xl text-left custom-scrollbar transition-all ${
                  isScrollable ? "rounded-tl-2xl rounded-bl-2xl" : "rounded-2xl"
                }`}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-700 bg-opacity-80 hover:bg-opacity-100 transition-all"
                >
                  <FaTimes className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Image */}
                <div className="w-full h-64 md:h-80 relative">
                  <img
                    src={`${baseURL}${post.imgPath}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="pt-8 pb-5 px-8 text-black dark:text-white">
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <FaClock />
                      {post.createdAt
                        ? format(new Date(post.createdAt), "MMMM dd, yyyy")
                        : "Unknown date"}
                    </span>
                    <span>{post.userName}</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {post.title}
                  </h1>

                  <div className="prose dark:prose-invert max-w-none mb-8">
                    {post.content?.split("\n\n").map((para, index) => (
                      <p key={index}>{para}</p>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 border-t pt-4">
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                      <FaShare />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                      <FaBookmark />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                      <FaClock />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BlogPostDetailModal;
