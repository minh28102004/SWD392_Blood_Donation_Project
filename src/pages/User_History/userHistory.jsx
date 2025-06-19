import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaHeart, FaTint } from "react-icons/fa";
import Header from "@pages/HomePage/Header";
import RequestHistory from "./Request_History";
import DonationHistory from "./Donation_History";

const BloodHistoryPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

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
                Reciption History
              </Tab>
            </Tab.List>

            <Tab.Panels as="div" className="mt-4">
              <AnimatePresence mode="wait">
                <Tab.Panel as="div" key="donation" className="space-y-4">
                  <DonationHistory />
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
