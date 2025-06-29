import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaTimes,
  FaUser,
  FaTint,
  FaPhone,
  FaMapMarkerAlt,
  FaHeartbeat,
} from "react-icons/fa";

const ViewDetailRequest = ({ data, isOpen, onClose }) => {
  if (!data) return null;

  const getStatusClass = (status) => {
    if (!status) return "text-gray-500";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "pending") return "text-yellow-600 font-semibold";
    if (lowerStatus === "successful") return "text-green-600 font-semibold";
    if (lowerStatus === "cancelled") return "text-red-600 font-semibold";
    return "text-gray-500";
  };

  const DetailRow = ({ label, value, valueClass = "", icon = null }) => (
    <div className="flex justify-between items-start border-b pb-2">
      <div className="flex items-center font-medium">
        {icon && <span className="mr-1 text-gray-500">{icon}</span>}
        {label}:
      </div>
      <span className={`ml-2 break-words max-w-[60%] text-right ${valueClass}`}>
        {value}
      </span>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay with smooth transition */}
        <div className="fixed inset-0 bg-black bg-opacity-70" />

        {/* Centered Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <Dialog.Panel className="relative w-full max-w-3xl max-h-[95vh] transform overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all py-6 px-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition"
              >
                <FaTimes size={22} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 dark:text-gray-200 relative py-4">
                {/* Divider Line */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 dark:bg-gray-600"></div>

                {/* Personal Info */}
                <div className="px-4">
                  <h3 className="flex justify-center items-center text-lg font-bold mb-4">
                    <FaUser className="mr-2" /> Personal Information
                  </h3>
                  <div className="space-y-4">
                    <DetailRow label="Request ID" value={data.bloodRequestId} />
                    <DetailRow
                      label="Phone"
                      value={data.phone || "N/A"}
                      icon={<FaPhone />}
                    />
                    <DetailRow
                      label="Height (cm)"
                      value={data.heightCm || "N/A"}
                    />
                    <DetailRow
                      label="Weight (kg)"
                      value={data.weightKg || "N/A"}
                    />
                    <DetailRow
                      label="Health Info"
                      value={data.healthInfo || "N/A"}
                      icon={<FaHeartbeat />}
                    />
                    <DetailRow
                      label="Location"
                      value={data.location}
                      icon={<FaMapMarkerAlt />}
                    />
                  </div>
                </div>

                {/* Blood Info */}
                <div className="px-4">
                  <h3 className="flex justify-center items-center text-lg font-bold mb-4">
                    <FaTint className="mr-2" /> Blood Request Information
                  </h3>
                  <div className="space-y-4">
                    <DetailRow label="Blood Type" value={data.bloodTypeName} />
                    <DetailRow
                      label="Blood Component"
                      value={data.bloodComponentName}
                    />
                    <DetailRow
                      label="Emergency"
                      value={data.isEmergency ? "Yes" : "No"}
                      valueClass={
                        data.isEmergency
                          ? "text-red-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    />
                    <DetailRow label="Quantity (ml)" value={data.quantity} />
                    <DetailRow
                      label="Status"
                      value={data.status?.name || "N/A"}
                      valueClass={getStatusClass(data.status?.name)}
                    />
                    <DetailRow
                      label="Created At"
                      value={new Date(data.createdAt).toLocaleString()}
                    />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewDetailRequest;
