import React, { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { fetchBloodTypes } from "@redux/features/bloodTypeSlice";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { TextInput, SelectInput, NumberInput } from "@components/Form_Input";
import { fetchBloodComponents } from "@redux/features/bloodComponentSlice";
import {
  createBloodInventory,
  updateBloodInventory,
} from "@redux/features/bloodInvSlice";
import { useDispatch } from "react-redux";
import LocationSelector from "./LocationSelector";

const InventoryModal = ({
  isOpen,
  onClose,
  selectedBloodInventory,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { bloodTypeList } = useSelector((state) => state.bloodType);
  const { bloodComponentList } = useSelector((state) => state.bloodComponent);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      bloodComponentId: selectedBloodInventory?.bloodComponentId || "",
      bloodTypeId: selectedBloodInventory?.bloodTypeId || "",
      quantity: selectedBloodInventory?.quantity || "",
      unit: selectedBloodInventory?.unit || "",
      inventoryLocation: selectedBloodInventory?.inventoryLocation || "",
    },
  });

  // Dropdown options
  const bloodTypeOptions = bloodTypeList.map((type) => ({
    value: type.bloodTypeId,
    label: type.name + type.rhFactor,
  }));
  const bloodComponentOptions = bloodComponentList.map((component) => ({
    value: component.bloodComponentId,
    label: component.name,
  }));

  useEffect(() => {
    dispatch(
      fetchBloodTypes({
        page: 1,
        size: 100,
      })
    );
    dispatch(
      fetchBloodComponents({
        page: 1,
        size: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (selectedBloodInventory) {
      setValue("bloodComponentId", selectedBloodInventory.bloodComponentId);
      setValue("bloodTypeId", selectedBloodInventory.bloodTypeId);
      setValue("quantity", selectedBloodInventory.quantity);
      setValue("unit", selectedBloodInventory.unit);
      setValue("inventoryLocation", selectedBloodInventory.inventoryLocation);
    }
  }, [selectedBloodInventory, setValue]);

  const onSubmit = async (data) => {
    const { bloodTypeId, bloodComponentId, quantity, unit, inventoryLocation } =
      data;
    const formDataToSend = new FormData();
    formDataToSend.append("BloodComponentId", bloodComponentId);
    formDataToSend.append("BloodTypeId", bloodTypeId);
    formDataToSend.append("Quantity", quantity);
    formDataToSend.append("Unit", unit);
    formDataToSend.append("inventoryLocation", inventoryLocation);

    setLoading(true);
    try {
      if (selectedBloodInventory) {
        const resultAction = await dispatch(
          updateBloodInventory({
            id: selectedBloodInventory.inventoryId,
            formData: formDataToSend,
          })
        );
        if (updateBloodInventory.fulfilled.match(resultAction)) {
          toast.success("Blood inventory updated successfully!");
          onSuccess();
        } else {
          toast.error("Update failed: " + resultAction.payload);
        }
      } else {
        const resultAction = await dispatch(
          createBloodInventory({ formData: formDataToSend })
        );
        if (createBloodInventory.fulfilled.match(resultAction)) {
          toast.success("Blood inventory created successfully!");
          onSuccess();
        } else {
          toast.error("Create failed: " + resultAction.payload);
        }
      }
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to submit blood inventory");
      console.error("Error submitting blood inventory:", error);
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
              <Dialog.Panel className="relative w-full max-w-xl max-h-[120vh] transform rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all py-6 pl-6 pr-2">
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
                  {selectedBloodInventory
                    ? "Edit Inventory"
                    : "Create New Inventory"}
                </Dialog.Title>
                <hr className="border-gray-100 mb-6" />
                <div className="custom-scrollbar max-h-[80vh] overflow-y-auto pl-1 pr-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Blood Type Dropdown */}
                      <SelectInput
                        label="Blood Type :"
                        name="bloodTypeId"
                        register={register}
                        placeholder={"Select Blood Type"}
                        errors={errors}
                        options={bloodTypeOptions}
                        validation={{
                          required: "Blood Type is required",
                        }}
                      />
                      {/* Blood Component Dropdown */}
                      <SelectInput
                        label="Blood Component :"
                        name="bloodComponentId"
                        register={register}
                        placeholder={"Select Blood Component"}
                        validation={{
                          required: "Blood Component is required",
                        }}
                        errors={errors}
                        options={bloodComponentOptions}
                      />

                      {/* Quantity */}
                      <NumberInput
                        label="Quantity :"
                        name="quantity"
                        placeholder="Enter Quantity"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Quantity is required",
                        }}
                      />

                      {/* Unit */}
                      <TextInput
                        label="Unit :"
                        name="unit"
                        placeholder="Enter Unit"
                        register={register}
                        errors={errors}
                        validation={{
                          required: "Unit is required",
                        }}
                      />
                    </div>
                    {/* Location */}
                    <LocationSelector
                      register={register}
                      setValue={setValue}
                      getValues={getValues}
                      errors={errors}
                      required={true}
                    />

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
                        className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-t from-rose-400 via-rose-500 to-red-400 rounded-lg hover:brightness-90 transition-all duration-200 shadow-sm"
                      >
                        {isSubmitting
                          ? selectedBloodInventory
                            ? "Updating..."
                            : "Creating..."
                          : selectedBloodInventory
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
