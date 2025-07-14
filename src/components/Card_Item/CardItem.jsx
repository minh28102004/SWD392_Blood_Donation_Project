import React from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

const CardItem = ({
  item,
  onView,
  onDelete,
  type = "request", // "request" hoặc "donation"
}) => {
  const isPending =
    type === "request"
      ? item?.status?.name?.toLowerCase() === "pending"
      : item?.statusName?.toLowerCase() === "pending";

  const renderStatusBadge = () => {
    const status =
      type === "request"
        ? item.status?.name?.toLowerCase()
        : item.statusName?.toLowerCase();
    const label = type === "request" ? item.status?.name : item.statusName;

    let style = "bg-green-100 text-green-800";
    if (status === "pending") style = "bg-yellow-100 text-yellow-800";
    else if (status === "cancelled") style = "bg-red-100 text-red-800";

    return (
      <span
        className={`ml-2 font-medium px-2 py-0.5 rounded-full text-xs ${style}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div
      className="bg-gradient-to-br from-rose-50 via-white to-rose-50 relative p-3 rounded-xl shadow-md border dark:border-gray-700 
             transition-transform duration-300 ease-in-out 
             hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Icons top right */}
      <div className="absolute top-2 right-2 flex gap-2">
        <Tooltip title="View detail request">
          <button
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-500"
            onClick={() => onView(item)}
          >
            <FaEye size={18} />
          </button>
        </Tooltip>

        {isPending && (
          <>
            <Tooltip title="Cancel request send">
              <button
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                onClick={() => onDelete(item)}
              >
                <FaTrash size={18} />
              </button>
            </Tooltip>
          </>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {type === "request" ? (
            <>
              Request ID:{" "}
              <span className="font-medium">{item.bloodRequestId}</span>
            </>
          ) : (
            <>
              Donation ID:{" "}
              <span className="font-medium">{item.donateRequestId}</span>
            </>
          )}
        </div>

        <div>
          <span className="font-semibold">Blood Type:</span>{" "}
          {type === "request"
            ? item.bloodTypeName
            : `${item.bloodType?.name}${item.bloodType?.rhFactor || ""}`}
        </div>

        <div>
          <span className="font-semibold">Component:</span>{" "}
          {type === "request"
            ? item.bloodComponentName
            : item.bloodComponent?.name || "N/A"}
        </div>

        <div>
          <span className="font-semibold">Quantity:</span> {item.quantity} ml
        </div>

        {type === "request" && (
          <div>
            <span className="font-semibold">Emergency:</span>
            <span
              className={`ml-2 font-medium px-2 py-0.5 rounded-full text-xs ${
                item.isEmergency
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              {item.isEmergency ? "Yes" : "No"}
            </span>
          </div>
        )}

        <div>
          <span className="font-semibold">Status:</span>
          {renderStatusBadge()}
        </div>
        {type === "donation" && (
          <div>
            <span className="font-semibold">Preferred Date:</span>{" "}
            {new Date(item.preferredDate).toLocaleDateString()}
          </div>
        )}
        <div>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default CardItem;
