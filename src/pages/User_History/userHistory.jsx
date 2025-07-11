import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { AnimatePresence } from "framer-motion";
import Header from "@pages/HomePage/Header";
import {
  fetchBloodComponents,
  fetchBloodTypes,
} from "@redux/features/bloodSlice";
import RequestHistory from "./Request_History";
import DonationHistory from "./Donation_History";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const BloodHistoryPage = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const location = useLocation();
  const selectedUser = location.state?.user;
  const { bloodComponents, bloodTypes } = useSelector((state) => state.blood);

  useEffect(() => {
    dispatch(fetchBloodTypes());
    dispatch(fetchBloodComponents());
  }, [dispatch]);

  const bloodTypeOptions = bloodTypes.map((bt) => ({
    value: bt.bloodTypeId.toString(),
    label: `${bt.name}${bt.rhFactor}`,
  }));

  const bloodComponentOptions = bloodComponents.map((bc) => ({
    value: bc.bloodComponentId.toString(),
    label: bc.name,
  }));

  return (
    <div
      className="min-h-screen flex flex-col 
  bg-gradient-to-br from-rose-50 via-blue-50 to-rose-50 
  dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
    >
      <Header />
      <main className="flex-grow flex flex-col">
        <div className="max-w-7xl w-full mx-auto pt-16 flex-grow flex flex-col">
          <div className="bg-white mt-4 dark:bg-gray-800 dark:text-white rounded-xl shadow-md p-6 mb-6 flex-grow flex flex-col">
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

              <Tab.Panels as="div" className="mt-4 flex-grow">
                <AnimatePresence mode="wait">
                  <Tab.Panel
                    as="div"
                    key="donation"
                    className="space-y-4 h-full"
                  >
                    <DonationHistory
                      user={selectedUser}
                      bloodType={bloodTypeOptions}
                      bloodComponent={bloodComponentOptions}
                    />
                  </Tab.Panel>

                  <Tab.Panel
                    as="div"
                    key="reception"
                    className="space-y-4 h-full"
                  >
                    <RequestHistory
                      user={selectedUser}
                      bloodType={bloodTypeOptions}
                      bloodComponent={bloodComponentOptions}
                    />
                  </Tab.Panel>
                </AnimatePresence>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BloodHistoryPage;
