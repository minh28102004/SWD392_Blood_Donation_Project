import React, { useRef, useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes, FaHospital } from "react-icons/fa";
import { GiDroplets } from "react-icons/gi";
import DonateForm from "./Donate_Form";
import RequestForm from "./Request_Form";
import SuccessModal from "./Success_Modal";
import { useNavigate } from "react-router-dom";
import useOutsideClick from "@hooks/useOutsideClick";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createBloodRequest } from "@redux/features/bloodRequestSlice";
import {
  fetchBloodComponents,
  fetchBloodTypes,
} from "@redux/features/bloodSlice";

const BloodDonationModal = ({ isOpen, setIsOpen }) => {
  const [visible, setVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("donate");
  const [formData, setFormData] = useState({});
  const modalRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);

  useEffect(() => {
    const fetchData = async () => {
      if (!bloodComponents.length && !bloodTypes.length) {
        await dispatch(fetchBloodComponents());
        await dispatch(fetchBloodTypes());
      }
    };
    fetchData();
  }, [dispatch]);

  // Delay unmount to allow exit animation
  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  const closeModal = () => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  useOutsideClick(modalRef, closeModal, visible);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const buildRequestFormData = (data) => {
      const form = new FormData();
      form.append("UserId", 1);
      form.append("Name", data.name);
      form.append("DateOfBirth", data.dateOfBirth);
      form.append("Phone", data.contact);
      form.append("BloodTypeId", parseInt(data.bloodTypeId));
      form.append("BloodComponentId", parseInt(data.bloodComponentId));
      form.append(
        "IsEmergency",
        data.urgencyLevel === "true" || data.urgencyLevel === true
      );
      form.append("Location", data.location);
      form.append("Quantity", parseInt(data.quantityUnit));
      form.append("HeightCm", parseFloat(data.height));
      form.append("WeightKg", parseFloat(data.weight));
      form.append("HealthInfo", data.medicalContext || "");
      form.append("Status", 0);
      return form;
    };
    if (activeTab === "request") {
      try {
        const formattedData = buildRequestFormData(formData);
        await dispatch(createBloodRequest(formattedData)).unwrap();
        toast.success("Blood Request created successfully!");
        setModalSuccess(true);
      } catch (error) {
        console.error("Failed to submit blood request:", error);
        toast.error("Failed to submit request");
      }
    } else {
      setModalSuccess(true);
    }
  };

  return (
    <>
      <Transition appear show={visible && !modalSuccess} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-70"
            leave="ease-in duration-200"
            leaveFrom="opacity-70"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal content */}
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
                  ref={modalRef}
                  className="inline-block w-full max-w-2xl px-8 py-6 text-left align-middle bg-white dark:bg-gray-900 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 relative z-50"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="w-full text-2xl ml-9 text-center font-bold text-gray-900 dark:text-white">
                      Blood Donation & Request Portal
                    </Dialog.Title>
                    <button onClick={closeModal}>
                      <FaTimes className="text-xl text-gray-500" />
                    </button>
                  </div>

                  {/* Tabs */}
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

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="custom-scrollbar space-y-4 max-h-[70vh] overflow-y-auto pl-1 pr-1"
                  >
                    {activeTab === "donate" ? (
                      <DonateForm onChange={handleInputChange} />
                    ) : (
                      <RequestForm
                        onChange={handleInputChange}
                        bloodTypes={bloodTypes}
                        bloodComponents={bloodComponents}
                      />
                    )}

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

      {/* Success Modal */}
      <SuccessModal
        isOpen={modalSuccess}
        onClose={() => {
          setModalSuccess(false);
          closeModal();
        }}
        onContinue={() => {
          setModalSuccess(false);
          setVisible(true);
        }}
        onViewHistory={() => {
          setModalSuccess(false);
          closeModal();
          navigate("/userHistory");
        }}
      />
    </>
  );
};

export default BloodDonationModal;
