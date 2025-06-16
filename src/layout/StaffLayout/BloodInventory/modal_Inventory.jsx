import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { TextInput } from "@components/Form_Input";
import ImageUploadInput from "@components/Image_Input";
import { bloodTypes } from "@pages/HomePage/About_blood/blood_Data";

const InventoryModal = ({ isOpen, onClose, selectedInventory }) => {
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      inventoryID: selectedInventory?.inventoryID || "",
      bloodTypes: selectedInventory?.bloodTypes || "",
      quantity_unit: selectedInventory?.category || "",
    },
  });

  const validateForm = (data) => {
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateForm(data)) return;
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      toast.success(
        selectedInventory
          ? "Inventory updated successfully!"
          : "Inventory created successfully!"
      );
      reset();

      onClose();
    } catch {
      toast.error("Failed to submit Inventory");
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

  const importantFields = [
    "blood_component_id",
    "blood_type_id",
    "quantity",
    "unit",
  ];

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
                className={`relative w-full max-w-2xl max-h-[95vh] transform rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all 
               py-6 pl-6 pr-2 }`}
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                <Dialog.Title
                  as="h2"
                  className="text-2xl font-bold leading-6 text-gray-900 dark:text-white mb-4 text-center"
                >
                  {selectedInventory
                    ? "Edit Inventory"
                    : "Create New Inventory"}
                </Dialog.Title>
                <hr className="border-gray-100 mb-6" />
                <div className="custom-scrollbar max-h-[80vh] overflow-y-auto pl-1 pr-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TextInput
                        label={
                          <>
                            {importantFields.includes("BloodTypeId") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Blood Type ID :
                          </>
                        }
                        name="BloodTypeId"
                        placeholder="Enter Blood Type ID"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Blood Type ID is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s]*$/,
                            message: "No special characters allowed",
                          },
                        }}
                      />

                      <TextInput
                        label={
                          <>
                            {importantFields.includes("blood_component_id") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Blood Component :
                          </>
                        }
                        name="blood_component_id"
                        placeholder="Enter Blood Component ID"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Blood Component ID is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s]*$/,
                            message: "No special characters allowed",
                          },
                        }}
                      />

                      <TextInput
                        label={
                          <>
                            {importantFields.includes("quantity") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Quantity :
                          </>
                        }
                        name="quantity"
                        placeholder="Enter Quantity"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Quantity is required",
                        }}
                      />
                      <TextInput
                        label={
                          <>
                            {importantFields.includes("unit") && (
                              <span className="text-red-600 mr-1">*</span>
                            )}
                            Unit :
                          </>
                        }
                        name="unit"
                        placeholder="Enter Unit"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Unit is required",
                        }}
                      />
                      <TextInput
                        label={<>Location :</>}
                        name="location"
                        placeholder="Enter Location"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Location is required",
                        }}
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg hover:brightness-90 transition-all duration-200 shadow-sm"
                      >
                        {isSubmitting
                          ? selectedInventory
                            ? "Updating..."
                            : "Creating..."
                          : selectedInventory
                          ? "Update Inventory"
                          : "Create Inventory"}
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

export default InventoryModal;
