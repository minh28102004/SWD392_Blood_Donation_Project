import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiUpload, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";

const BlogPostModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    content: "",
    category: "",
    featuredImage: null,
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Technology",
    "Travel",
    "Food",
    "Lifestyle",
    "Business",
    "Health",
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      if (
        ![".jpg", ".jpeg", ".png"].includes(
          file.name.toLowerCase().substr(file.name.lastIndexOf("."))
        )
      ) {
        toast.error("Only JPEG and PNG files are allowed");
        return;
      }
      setFormData((prev) => ({ ...prev, featuredImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    const words = formData.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  }, [formData.content]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId || !/^\d+$/.test(formData.userId)) {
      newErrors.userId = "Please enter a valid user ID";
    }
    if (formData.title.length < 10 || formData.title.length > 100) {
      newErrors.title = "Title must be between 10 and 100 characters";
    }
    if (formData.title.match(/[^a-zA-Z0-9\s]/)) {
      newErrors.title = "Title cannot contain special characters";
    }
    if (formData.content.replace(/<[^>]*>/g, "").length < 100) {
      newErrors.content = "Content must be at least 100 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // TODO: Call API here
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Blog post created successfully!");
        setFormData({
          userId: "",
          title: "",
          content: "",
          category: "",
          featuredImage: null,
        });
        setPreview(null);
        onClose();
      } catch (error) {
        toast.error("Failed to create blog post");
      } finally {
        setLoading(false);
      }
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link", "image", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-70"
          leave="ease-in duration-200"
          leaveFrom="opacity-70"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 mb-6"
                >
                  Create New Blog Post
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User ID */}
                  <div>
                    <label
                      className="block mb-2 font-semibold"
                      htmlFor="userId"
                    >
                      User ID *
                    </label>
                    <input
                      type="number"
                      id="userId"
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                      required
                    />
                    {errors.userId && (
                      <p className="mt-1 text-red-500 text-sm">{errors.userId}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block mb-2 font-semibold" htmlFor="title">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                      required
                    />
                    {errors.title && (
                      <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className="block mb-2 font-semibold"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Featured Image
                    </label>
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
                    >
                      <input {...getInputProps()} />
                      {preview ? (
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreview(null);
                              setFormData({ ...formData, featuredImage: null });
                            }}
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2">Drag & drop or click to upload</p>
                          <p className="text-sm text-gray-500">
                            Maximum file size: 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block mb-2 font-semibold">Content *</label>
                    <ReactQuill
                      value={formData.content}
                      onChange={(content) =>
                        setFormData({ ...formData, content: content })
                      }
                      modules={modules}
                      className="bg-white rounded-lg"
                    />
                    {errors.content && (
                      <p className="mt-1 text-red-500 text-sm">{errors.content}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      <span>Words: {wordCount}</span>
                      <span className="mx-2">|</span>
                      <span>Estimated reading time: {readingTime} min</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-3 rounded-lg font-semibold text-white ${
                        loading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {loading ? "Creating..." : "Create Post"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <ToastContainer position="bottom-right" theme="light" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BlogPostModal;
