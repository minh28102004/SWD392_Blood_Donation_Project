// 📁 components/SuccessModal.jsx
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaRedo, FaListUl, FaTimes } from "react-icons/fa";

const SuccessModal = ({ isOpen, onClose, onContinue, onViewHistory }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as={Fragment} open={isOpen} onClose={onClose}>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 text-center">
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl z-50"
            >
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <FaCheckCircle className="text-green-500 text-5xl" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Your request has been submitted successfully!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  What would you like to do next?
                </p>

                <div className="flex flex-col gap-3 w-full mt-4">
                  <button
                    onClick={onContinue}
                    className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                  >
                    <FaRedo /> Submit Another Request
                  </button>

                  <button
                    onClick={onViewHistory}
                    className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
                  >
                    <FaListUl /> View Request History
                  </button>

                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
                  >
                    <FaTimes /> Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
