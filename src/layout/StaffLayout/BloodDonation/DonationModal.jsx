import React, {  useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { TextInput, DateInput, TextAreaInput } from "@components/Form_Input";

const DonationModal = ({ isOpen, onClose, selectedRequest }) => {
//   const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      donateRequestId: selectedRequest?.donateRequestId || "",
      location: selectedRequest?.location || "",
      preferredDate: selectedRequest?.preferredDate || "",
      quantity: selectedRequest?.quantity || "",
      note: selectedRequest?.note || "",
    },
  });

  useEffect(() => {
    if (selectedRequest) {
      reset({
        donateRequestId: selectedRequest.donateRequestId,
        location: selectedRequest.location,
        preferredDate: selectedRequest.preferredDate,
        quantity: selectedRequest.quantity,
        note: selectedRequest.note,
      });
    }
  }, [selectedRequest, reset]);

 // Xoá nếu không cần dùng
// const [loading, setLoading] = useState(false);

const onSubmit = async (data) => {
  try {
    console.log(data); // sử dụng để tránh eslint warning
    await new Promise((res) => setTimeout(res, 1500));
    toast.success(
      selectedRequest
        ? "Donation request updated successfully!"
        : "Donation request created successfully!"
    );
    onClose();
    reset();
  } catch  {
    toast.error("Failed to submit donation request");
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
              <Dialog.Panel className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all py-6 px-6">
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
                  {selectedRequest ? "Edit Donation Request" : "Create Donation Request"}
                </Dialog.Title>
                <hr className="border-gray-100 mb-6" />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                      label="Location"
                      name="location"
                      placeholder="Enter location"
                      register={register}
                      errors={errors}
                      validation={{ required: "Location is required" }}
                    />

                    <DateInput
                      label="Preferred Date"
                      name="preferredDate"
                      register={register}
                      errors={errors}
                      validation={{ required: "Date is required" }}
                    />

                    <TextInput
                      label="Quantity (ml)"
                      name="quantity"
                      placeholder="e.g. 450"
                      type="number"
                      register={register}
                      errors={errors}
                      validation={{ required: "Quantity is required" }}
                    />
                  </div>

                  <TextAreaInput
                    label="Note"
                    name="note"
                    placeholder="Enter any additional notes..."
                    register={register}
                    errors={errors}
                  />

                  <div className="flex justify-end space-x-4 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-400 to-red-600 rounded-lg hover:brightness-90 transition-all"
                    >
                      {isSubmitting
                        ? selectedRequest
                          ? "Updating..."
                          : "Creating..."
                        : selectedRequest
                        ? "Update Request"
                        : "Create Request"}
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

export default DonationModal;
