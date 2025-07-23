import React, { useRef, useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes, FaHospital } from "react-icons/fa";
import { GiDroplets } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DonateForm from "./Donate_Form";
import RequestForm from "./Request_Form";
import { createBloodRequest } from "@redux/features/bloodRequestSlice";
import { createDonationRequest } from "@redux/features/bloodDonationSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBloodComponents,
  fetchBloodTypes,
} from "@redux/features/bloodSlice";
import { setShouldReloadList } from "@redux/features/notificationSlice";

const BloodDonationModal = ({ isOpen, userId, onClose }) => {
  const [activeTab, setActiveTab] = useState("donate");
  const dispatch = useDispatch();
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);
  const [showMedicalModal, setShowMedicalModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bloodTypeId: "",
      bloodComponentId: "",
      quantityUnit: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!bloodComponents.length) await dispatch(fetchBloodComponents());
      if (!bloodTypes.length) await dispatch(fetchBloodTypes());
    };
    fetchData();
  }, [dispatch]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const buildFormData = (data, isRequest) => {
    const form = new FormData();
    form.append("UserId", userId);
    form.append("Name", data.name);
    form.append("DateOfBirth", data.dateOfBirth);
    form.append("Phone", data.contact);
    form.append("BloodTypeId", parseInt(data.bloodTypeId));
    form.append("BloodComponentId", parseInt(data.bloodComponentId));
    form.append("Quantity", parseInt(data.quantityUnit));
    form.append("HeightCm", parseFloat(data.height));
    form.append("WeightKg", parseFloat(data.weight));
    form.append("HealthInfo", data.medicalContext || "");
    form.append("Location", data.location || "");
    if (isRequest) {
      form.append("IsEmergency", data.urgencyLevel === "true");
      form.append("Status", 0);
    } else {
      form.append("LastDonationDate", data.lastDonationDate || "");
      form.append("PreferredDate", data.preferredDate || "");
      form.append("Status", 0);
    }
    return form;
  };

  const onSubmit = async (data) => {
    try {
      const form = buildFormData(data, activeTab === "request");

      if (activeTab === "request") {
        await dispatch(createBloodRequest(form)).unwrap();
        toast.success("Blood Request created successfully!");
      } else {
        for (let [key, val] of form.entries()) {
          console.log(`${key}:`, val);
        }
        await dispatch(createDonationRequest(form)).unwrap();
        toast.success("Donation Request created successfully!");
      }
      dispatch(setShouldReloadList(true));
      reset();
      handleClose();
    } catch (error) {
      console.error("Failed to submit:", error);
      toast.error("Failed to submit form");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />

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
              <Dialog.Panel className="inline-block w-full max-w-2xl px-8 py-6 text-left align-middle bg-white dark:bg-gray-900 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 relative z-50">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="w-full text-2xl ml-9 text-center font-bold text-gray-900 dark:text-white">
                    Blood Donation & Request Portal
                  </Dialog.Title>
                  <button onClick={handleClose}>
                    <FaTimes className="text-xl text-gray-500" />
                  </button>
                </div>

                <div className="flex gap-4 mb-6 pl-1 pr-1">
                  <button
                    onClick={() => setActiveTab("donate")}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                      activeTab === "donate"
                        ? "bg-gradient-to-br from-green-600 to-green-400 text-white dark:from-emerald-600 dark:to-emerald-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <GiDroplets className="text-xl" /> Donate
                  </button>
                  <button
                    onClick={() => setActiveTab("request")}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                      activeTab === "request"
                        ? "bg-gradient-to-br from-red-600 to-red-400 text-white dark:from-rose-600 dark:to-rose-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaHospital className="text-xl" /> Request
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="custom-scrollbar space-y-4 max-h-[70vh] overflow-y-auto pl-1 pr-1"
                >
                  {activeTab === "donate" ? (
                    <DonateForm
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      bloodTypes={bloodTypes}
                      bloodComponents={bloodComponents}
                      setShowMedicalModal={setShowMedicalModal}
                      showMedicalModal={showMedicalModal}
                    />
                  ) : (
                    <RequestForm
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      bloodTypes={bloodTypes}
                      bloodComponents={bloodComponents}
                      setShowMedicalModal={setShowMedicalModal}
                      showMedicalModal={showMedicalModal}
                    />
                  )}
                  <div className="flex items-start gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="agreeCheck"
                      name="agreeCheck"
                      required
                      className="h-3 w-3 mt-1"
                    />
                    <label
                      htmlFor="agreeCheck"
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      I confirm that all provided information is accurate and
                      complete.
                    </label>
                  </div>

                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className={`mt-4 px-3 py-1 rounded-xl text-white font-medium shadow-lg transition-all duration-300 ${
                        activeTab === "donate"
                          ? "bg-emerald-500 hover:bg-green-700"
                          : "bg-red-400 hover:bg-red-700"
                      }`}
                    >
                      {activeTab === "donate"
                        ? "Submit Donation"
                        : "Submit Request"}
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

export default BloodDonationModal;
