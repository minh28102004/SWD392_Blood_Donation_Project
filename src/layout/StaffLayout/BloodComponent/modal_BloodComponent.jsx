import React, { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  createBloodComponent,
  updateBloodComponent,
} from "@redux/features/bloodComponentSlice";

const BloodComponentModal = ({ isOpen, onClose, selectedBloodComponent, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      bloodComponentId: selectedBloodComponent?.bloodComponentId || "",
      name: selectedBloodComponent?.name || "",
    },
  });

  useEffect(() => {
    if (selectedBloodComponent) {
      setValue("bloodComponentId", selectedBloodComponent.bloodComponentId);
      setValue("name", selectedBloodComponent.name);
    }
  }, [selectedBloodComponent, setValue]);

  const onSubmit = async (data) => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", data.name);
  

    setLoading(true);
    try {
      if (selectedBloodComponent) {
        const result = await dispatch(
          updateBloodComponent({
            id: selectedBloodComponent.bloodComponentId,
            formData: formDataToSend,
          })
        );
        if (updateBloodComponent.fulfilled.match(result)) {
          toast.success("Blood component updated successfully!");
          onSuccess();
        } else {
          toast.error("Update failed: " + result.payload);
        }
      } else {
        const result = await dispatch(
          createBloodComponent({ formData: formDataToSend })
        );
        if (createBloodComponent.fulfilled.match(result)) {
          toast.success("Blood component created successfully!");
          onSuccess();
        } else {
          toast.error("Create failed: " + result.payload);
        }
      }
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to submit Blood component");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
              <Dialog.Panel className="relative w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                >
                  <FaTimes />
                </button>
                <Dialog.Title className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  {selectedBloodComponent ? "Edit Blood Component" : "Create Blood Component"}
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Blood Component ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">
                      Blood Component ID
                    </label>
                    <input
                      type="text"
                      {...register("bloodComponentId")}
                      disabled
                      className="mt-1 w-full rounded-lg border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">
                      <span className="text-red-600 mr-1">*</span>Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="mt-1 w-full rounded-lg border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                 

                  {/* Buttons */}
                  <div className="flex justify-end pt-4 space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isSubmitting
                        ? selectedBloodComponent
                          ? "Updating..."
                          : "Creating..."
                        : selectedBloodComponent
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BloodComponentModal;
