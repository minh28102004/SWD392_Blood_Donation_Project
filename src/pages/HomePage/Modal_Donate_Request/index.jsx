import React, { useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaHeart, FaTimes, FaHospital } from "react-icons/fa";
import { GiDroplets } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

const FormRow = ({ columns = 2, children }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
    {children}
  </div>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      <span className="text-orange-500">*</span> {label} :
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
  hover:border-blue-500 focus:border-blue-600 dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200"
    />
  </div>
);

const SelectField = ({ label, name, options = [], ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      <span className="text-orange-500">*</span> {label} :
    </label>
    <select
      name={name}
      {...props}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
  hover:border-blue-500 focus:border-blue-600 dark:hover:border-white  focus:outline-none focus:ring-1 transition-all duration-200"
    >
      <option value="" disabled hidden>
        Select
      </option>

      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      <span className="text-orange-500">*</span> {label} :
    </label>
    <textarea
      {...props}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
  hover:border-blue-500 focus:border-blue-600 dark:hover:border-white  focus:outline-none focus:ring-1 transition-all duration-200"
    ></textarea>
  </div>
);

const BloodDonationModal = ({ isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState("donate");
  const [formData, setFormData] = useState({});
  const modalRef = useRef();

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
    console.log("Form submitted:", formData);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <AnimatePresence>
        {isOpen && (
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
                    <>
                      <FormRow columns={2}>
                        <InputField
                          label="Full Name"
                          name="fullName"
                          onChange={handleInputChange}
                          required
                        />
                        <InputField
                          label="Age"
                          name="age"
                          type="number"
                          min="18"
                          max="65"
                          onChange={handleInputChange}
                          required
                        />
                      </FormRow>
                      <FormRow columns={2}>
                        <SelectField
                          label="Blood Type"
                          name="bloodType"
                          options={[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ]}
                          onChange={handleInputChange}
                          required
                        />
                        <SelectField
                          label="Blood Component"
                          name="bloodComponent"
                          options={[
                            "Plasma",
                            "Red Blood Cell",
                            "White Blood Cell",
                            "Platelet",
                          ]}
                          onChange={handleInputChange}
                          required
                        />
                      </FormRow>
                      <FormRow columns={2}>
                        <InputField
                          label="Quantity Unit (e.g. 350ml)"
                          name="quantityUnit"
                          onChange={handleInputChange}
                          required
                        />
                        <InputField
                          label="Contact Number"
                          name="contact"
                          onChange={handleInputChange}
                          required
                        />
                      </FormRow>
                      <FormRow columns={3}>
                        <InputField
                          label="Height (cm)"
                          name="height"
                          type="number"
                          onChange={handleInputChange}
                          required
                        />
                        <InputField
                          label="Weight (kg)"
                          name="weight"
                          type="number"
                          onChange={handleInputChange}
                          required
                        />
                        <InputField
                          label="Preferred Date"
                          name="preferredDate"
                          type="date"
                          onChange={handleInputChange}
                          required
                        />
                      </FormRow>
                      <InputField
                        label="Location"
                        name="location"
                        onChange={handleInputChange}
                        required
                      />
                      <TextAreaField
                        label="Note (optional)"
                        name="medicalContext"
                        rows={3}
                        onChange={handleInputChange}
                      />
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          name="healthScreening"
                          required
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-200">
                          I confirm that I am in good health and eligible to
                          donate blood
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <FormRow columns={2}>
                        <InputField
                          label="Full Name"
                          name="fullName"
                          onChange={handleInputChange}
                          required
                        />
                        <InputField
                          label="Age"
                          name="age"
                          type="number"
                          onChange={handleInputChange}
                          required
                        />
                      </FormRow>
                      <FormRow columns={2}>
                        <SelectField
                          label="Required Blood Type"
                          name="requiredBloodType"
                          options={[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ]}
                          onChange={handleInputChange}
                          required
                        />
                        <SelectField
                          label="Urgency Level"
                          name="urgencyLevel"
                          options={["Normal", "Emergency"]}
                          onChange={handleInputChange}
                          required
                        />
                      </FormRow>
                      <FormRow columns={2}>
                        <InputField
                          label="Quantity Unit"
                          name="quantityUnit"
                          onChange={handleInputChange}
                          required
                        />
                        <InputField
                          label="Contact Number"
                          name="contact"
                          onChange={handleInputChange}
                          required
                        />
                      </FormRow>
                      <TextAreaField
                        label="Note (optional)"
                        name="medicalContext"
                        rows={3}
                        onChange={handleInputChange}
                      />
                    </>
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
    </div>
  );
};

export default BloodDonationModal;
