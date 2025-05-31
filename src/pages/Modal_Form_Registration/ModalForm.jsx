import React, { useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaHeart, FaTimes, FaHospital } from "react-icons/fa";
import { GiDroplets } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import DonateForm from "./Donate_Form";
import RequestForm from "./Request_Form";
import SuccessModal from "./Success_Modal";
import { useNavigate } from "react-router-dom";  // <-- import useNavigate

const BloodDonationModal = ({ isOpen, setIsOpen }) => {
  const [modalSuccess, setModalSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("donate");
  const [formData, setFormData] = useState({});
  const modalRef = useRef();
  const navigate = useNavigate(); // <-- khởi tạo useNavigate

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalSuccess(true);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <AnimatePresence>
        {isOpen && !modalSuccess && (
          <Dialog as={Fragment} open={isOpen} onClose={() => setIsOpen(false)}>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 text-center">
              <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                ref={modalRef}
                className="inline-block w-full max-w-2xl px-8 py-6 text-left align-middle bg-white dark:bg-gray-900 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 relative z-50"
              >
                {/* Content */}
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="w-full text-2xl ml-9 text-center font-bold text-gray-900 dark:text-white">
                    Blood Donation & Request Portal
                  </Dialog.Title>
                  <button onClick={() => setIsOpen(false)}>
                    <FaTimes className="text-xl text-gray-500" />
                  </button>
                </div>

                <div className="flex gap-4 mb-6 pl-1 pr-1">
                  <button
                    onClick={() => setActiveTab("donate")}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2
  ${
    activeTab === "donate"
      ? "bg-gradient-to-br from-green-600 to-green-400 text-white dark:from-emerald-600 dark:to-emerald-400"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
  }`}
                  >
                    <GiDroplets className="text-xl" /> Donate
                  </button>
                  <button
                    onClick={() => setActiveTab("request")}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2
  ${
    activeTab === "request"
      ? "bg-gradient-to-br from-red-600 to-red-400 text-white dark:from-rose-600 dark:to-rose-400"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
  }`}
                  >
                    <FaHospital className="text-xl" /> Request
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="custom-scrollbar space-y-4 max-h-[65vh] overflow-y-auto pl-1 pr-1"
                >
                  {activeTab === "donate" ? (
                    <DonateForm onChange={handleInputChange} />
                  ) : (
                    <RequestForm onChange={handleInputChange} />
                  )}

                  <div className="flex justify-center mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
      {/*Success Modal*/}
      <SuccessModal
        isOpen={modalSuccess}
        onClose={() => {
          setModalSuccess(false);
          setIsOpen(false);
        }}
        onContinue={() => {
          setModalSuccess(false);
          setIsOpen(true);
        }}
        onViewHistory={() => {
          setModalSuccess(false);
          setIsOpen(false);
          navigate("/userHistory"); 
        }}
      />
    </div>
  );
};

export default BloodDonationModal;
