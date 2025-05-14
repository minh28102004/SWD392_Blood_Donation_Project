import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { faqData } from "./faqs_Data";
import { motion } from "framer-motion"; // Import motion from framer-motion

const FAQs = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 pb-6 pt-20 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        {/* Tiêu đề */}
        <motion.div
          className="text-center w-full"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
        >
          <h2 className="text-3xl font-bold text-red-800 mb-2">
            Blood Donation FAQs
          </h2>
          <p className="text-gray-600">
            Everything you need to know about blood donation
          </p>
        </motion.div>

        {/* Thanh tìm kiếm */}
        <motion.div
          className="relative w-full max-w-md ml-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            <FiSearch />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-blue-400"
          />
        </motion.div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-4 transition-all duration-300">
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-gray-500">No questions found.</p>
        ) : (
          filteredFaqs.map((item, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <motion.div
                key={index}
                className="border border-red-300 shadow-md overflow-hidden transition-all duration-300"
                initial={{ opacity: 0, y: 20 }} // Initial state for animation
                animate={{ opacity: 1, y: 0 }} // End state when animation runs
                transition={{ duration: 0.5, delay: index * 0.1 }} // Smooth transition with delay for each item
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex justify-between items-center w-full px-6 py-2 text-left bg-red-50 hover:bg-red-100 transition-colors duration-300"
                >
                  <span className="text-md font-semibold text-gray-800">
                    {index + 1}. {item.question}
                  </span>
                  <span className="text-2xl text-red-600 transition-transform duration-300 transform">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                <motion.div
                  className={`px-6 text-gray-700 bg-white border-t border-red-200 text-base overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "max-h-[1000px] py-3 opacity-100"
                      : "max-h-0 py-0 opacity-0"
                  }`}
                  initial={{ opacity: 0 }} // Initial state for the answer
                  animate={{ opacity: isOpen ? 1 : 0 }} // Toggle opacity based on state
                  transition={{ duration: 0.3 }} // Smooth transition for answer reveal
                >
                  <p className="font-medium whitespace-pre-line">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item.answer.trim(),
                      }}
                    ></span>
                  </p>
                </motion.div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FAQs;
