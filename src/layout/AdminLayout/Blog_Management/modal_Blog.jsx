import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { TextInput } from "@components/Form_Input";
import ImageUploadInput from "@components/Image_Input";

const BlogPostModal = ({ isOpen, onClose, selectedPost }) => {
  const [formData, setFormData] = useState({
    content: selectedPost?.content || "",
    featuredImage: selectedPost?.featuredImage || null,
  });
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      userId: selectedPost?.userId || "",
      title: selectedPost?.title || "",
      category: selectedPost?.category || "",
    },
  });

  useEffect(() => {
    const words = formData.content
      .replace(/<[^>]*>/g, "")
      .split(/\s+/)
      .filter(Boolean).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  }, [formData.content]);

  const validateForm = (data) => {
    const contentLength = formData.content.replace(/<[^>]*>/g, "").length;
    if (contentLength < 100) {
      toast.error("Content must be at least 100 characters long");
      return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateForm(data)) return;
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      toast.success(
        selectedPost
          ? "Blog post updated successfully!"
          : "Blog post created successfully!"
      );
      reset();
      setFormData({ content: "", featuredImage: null });
      onClose();
    } catch {
      toast.error("Failed to submit blog post");
    } finally {
      setLoading(false);
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

  const importantFields = ["userId", "title", "category"];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel
                className={`relative w-full max-w-2xl max-h-[95vh] transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all 
               py-6 pl-6 pr-2 }`}
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                <Dialog.Title
                  as="h2"
                  className="text-2xl font-bold leading-6 text-gray-900 mb-4 text-center"
                >
                  {selectedPost ? "Edit Blog Post" : "Create New Blog Post"}
                </Dialog.Title>
                <hr className="border-gray-100 mb-6" />
                <div className="custom-scrollbar max-h-[80vh] overflow-y-auto pl-1 pr-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TextInput
                        label={
                          <>
                            {importantFields.includes("userId") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            User ID :
                          </>
                        }
                        name="userId"
                        placeholder="Enter numeric user ID"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "User ID is required",
                          pattern: {
                            value: /^\d+$/,
                            message: "Only numeric user IDs allowed",
                          },
                        }}
                      />

                      <TextInput
                        label={
                          <>
                            {importantFields.includes("title") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Title :
                          </>
                        }
                        name="title"
                        placeholder="Enter blog title"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Title is required",
                          minLength: {
                            value: 10,
                            message: "Min 10 characters",
                          },
                          maxLength: {
                            value: 100,
                            message: "Max 100 characters",
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9\s]*$/,
                            message: "No special characters allowed",
                          },
                        }}
                      />

                      <TextInput
                        label={
                          <>
                            {importantFields.includes("category") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Category :
                          </>
                        }
                        name="category"
                        placeholder="Enter category"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Category is required",
                        }}
                      />
                    </div>

                    <div className="max-w-full">
                      <ImageUploadInput
                        value={formData.featuredImage}
                        onChange={(file) =>
                          setFormData((prev) => ({
                            ...prev,
                            featuredImage: file,
                          }))
                        }
                        error={errors.featuredImage?.message}
                        label={
                          <>
                            <span className="text-red-600 mr-1">*</span>
                            Featured Image :
                          </>
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <span className="text-red-600 mr-1">*</span>
                        Content :
                      </label>
                      <div className="h-[100px] relative">
                        <ReactQuill
                          value={formData.content}
                          onChange={(val) =>
                            setFormData((prev) => ({ ...prev, content: val }))
                          }
                          modules={modules}
                          className="bg-white rounded-lg h-full"
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 pt-6">
                      <span>Words: {wordCount}</span>
                      <span className="mx-2">|</span>
                      <span>Estimated reading time: {readingTime} min</span>
                    </div>

                    <div className="flex justify-end space-x-4 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                      >
                        {isSubmitting
                          ? selectedPost
                            ? "Updating..."
                            : "Creating..."
                          : selectedPost
                          ? "Update Post"
                          : "Create Post"}
                      </button>
                    </div>
                  </form>
                </div>
                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BlogPostModal;
