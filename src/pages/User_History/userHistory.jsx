import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaHeart, FaTint } from "react-icons/fa";
import Header from "@pages/HomePage/Header";
import RequestHistory from "./Request_History";

const BloodHistoryPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const donationHistory = [
    {
      id: 1,
      date: "2024-01-15",
      status: "Completed",
      location: "Central Blood Bank",
      bloodType: "A+",
      amount: "450ml",
    },
  ];

  const HistoryCard = ({ item, type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {type === "donation" ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaTint className="text-blue-500 text-xl" />
          )}
          <div>
            <h3 className="font-semibold text-gray-800">
              {type === "donation" ? "Blood Donation" : "Blood Reception"}
            </h3>
            <p className="text-sm text-gray-600">{item.date}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            item.status === "Completed"
              ? "bg-green-100 text-green-800"
              : item.status === "Processing"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Blood Type</p>
          <p className="font-medium">{item.bloodType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="font-medium">{item.amount}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-600">
            {type === "donation" ? "Location" : "Hospital"}
          </p>
          <p className="font-medium">
            {type === "donation" ? item.location : item.hospital}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div
      className="min-h-screen 
  bg-gradient-to-br from-rose-50 via-blue-50 to-rose-50 
  dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
    >
      <Header />
      <div className="max-w-7xl mx-auto pt-16">
        <div className="bg-white mt-4 dark:bg-gray-800 dark:text-white rounded-xl shadow-md p-6 mb-6 ">
          <Tab.Group as="div" onChange={setSelectedTab}>
            <Tab.List className="flex justify-center w-1/3 space-x-1 rounded-xl bg-blue-900/20 p-1 mx-auto">
              <Tab
                as="button"
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-semibold leading-5 ${
                    selected
                      ? "bg-white  text-red-700 shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                Donation History
              </Tab>
              <Tab
                as="button"
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-semibold leading-5 ${
                    selected
                      ? "bg-white text-red-700 shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                Reception History
              </Tab>
            </Tab.List>

            <Tab.Panels as="div" className="mt-4">
              <AnimatePresence mode="wait">
                <Tab.Panel as="div" key="donation" className="space-y-4">
                  {donationHistory.map((item) => (
                    <HistoryCard key={item.id} item={item} type="donation" />
                  ))}
                </Tab.Panel>

                <Tab.Panel as="div" key="reception" className="space-y-4">
                  <RequestHistory />
                </Tab.Panel>
              </AnimatePresence>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default BloodHistoryPage;
