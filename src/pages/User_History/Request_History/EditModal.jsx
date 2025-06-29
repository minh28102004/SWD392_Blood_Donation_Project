import React, { useState, Fragment, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaTint,
  FaRulerVertical,
  FaWeight,
} from "react-icons/fa";
import {
  TextInput,
  NumberInput,
  SelectInput,
  DateInput,
  TextAreaInput,
} from "@components/Form_Input";
import { updateBloodRequest } from "@redux/features/bloodRequestSlice";
import { toast } from "react-toastify";
import useOutsideClick from "@hooks/useOutsideClick";

const RequestCreationModal = ({
  isOpen,
  onClose,
  selectedRequest,
  onSuccess,
  bloodTypeList = [],
  bloodComponentList = [],
  statusList = [],
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  useOutsideClick(modalRef, onClose);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (selectedRequest) {
      reset({
        name: selectedRequest.name || "",
        dateOfBirth: selectedRequest.dateOfBirth || "",
        phone: selectedRequest.phone || "",
        userId: selectedRequest.userId || 0,
        bloodTypeId: selectedRequest.bloodTypeId || 0,
        bloodComponentId: selectedRequest.bloodComponentId || 0,
        isEmergency: selectedRequest.isEmergency ? "true" : "false",
        status: selectedRequest.status || 0,
        location: selectedRequest.location || "",
        quantity: selectedRequest.quantity || "",
        fulfilled: selectedRequest.fulfilled ? "true" : "false",
        fulfilledSource: selectedRequest.fulfilledSource || "",
        heightCm: selectedRequest.heightCm || "",
        weightKg: selectedRequest.weightKg || "",
        healthInfo: selectedRequest.healthInfo || "",
      });
    }
  }, [selectedRequest, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      isEmergency: data.isEmergency === "true",
      fulfilled: data.fulfilled === "true",
      quantity: Number(data.quantity),
      heightCm: data.heightCm ? Number(data.heightCm) : null,
      weightKg: data.weightKg ? Number(data.weightKg) : null,
      userId: Number(data.userId),
      status: Number(data.status),
      bloodTypeId: Number(data.bloodTypeId),
      bloodComponentId: Number(data.bloodComponentId),
    };

    try {
      await dispatch(
        updateBloodRequest({ id: selectedRequest.bloodRequestId, payload })
      ).unwrap();
      toast.success("Blood request updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Update failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-70" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel className="relative w-full max-w-2xl max-h-[95vh] transform rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all py-6 px-6 overflow-y-auto">
              <Dialog.Title className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Edit Blood Request - [{selectedRequest?.bloodRequestId}]
              </Dialog.Title>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              >
                <FaTimes />
              </button>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Row: Date of Birth - Is Emergency - Phone */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateInput
                    label="Date of Birth"
                    name="dateOfBirth"
                    register={register}
                    errors={errors}
                  />

                  <TextInput
                    label="Phone"
                    name="phone"
                    register={register}
                    errors={errors}
                    icon={FaPhone}
                    placeholder="Enter phone"
                  />
                </div>

                {/* Row: Blood Type - Blood Component  */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectInput
                    label="Blood Type"
                    name="bloodTypeId"
                    register={register}
                    errors={errors}
                    options={bloodTypeList}
                    icon={FaTint}
                  />

                  <SelectInput
                    label="Blood Component"
                    name="bloodComponentId"
                    register={register}
                    errors={errors}
                    options={bloodComponentList}
                    icon={FaTint}
                  />
                  <SelectInput
                    label="Is Emergency"
                    name="isEmergency"
                    register={register}
                    errors={errors}
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                </div>

                {/* Row: Height - Weight - Quantity */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NumberInput
                    label="Height (cm)"
                    name="heightCm"
                    register={register}
                    errors={errors}
                  />
                  <NumberInput
                    label="Weight (kg)"
                    name="weightKg"
                    register={register}
                    errors={errors}
                  />
                  <NumberInput
                    label="Quantity (ml)"
                    name="quantity"
                    register={register}
                    errors={errors}
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <TextInput
                    label="Location"
                    name="location"
                    register={register}
                    errors={errors}
                    icon={FaMapMarkerAlt}
                    placeholder="Enter location"
                  />
                </div>

                {/* Health Info */}
                <div className="md:col-span-2">
                  <TextAreaInput
                    label="Health Info"
                    name="healthInfo"
                    register={register}
                    errors={errors}
                    icon={FaHeartbeat}
                    placeholder="Health condition details"
                    row={2}
                  />
                </div>

                {/* Button */}
                <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
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
                    {isSubmitting ? "Updating..." : "Update Request"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RequestCreationModal;
