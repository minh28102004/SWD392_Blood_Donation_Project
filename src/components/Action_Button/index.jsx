import React from "react";
import { FaSyncAlt, FaPlus } from "react-icons/fa";

const ActionButtons = ({
  loading,
  loadingDelay,
  onReload,
  onCreate,
  createLabel = "User", // mặc định là User nếu không truyền
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      {onReload && (
        <button
          onClick={onReload}
          disabled={loading || loadingDelay}
          className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-br from-sky-500 to-blue-500 text-white rounded-md text-sm transition duration-200 hover:scale-105 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSyncAlt
            className={`transition-transform duration-200 ${
              loading || loadingDelay ? "animate-spin" : ""
            }`}
            size={14}
          />
          Reload Data
        </button>
      )}
      {onCreate && (
        <button
          onClick={onCreate}
          aria-label={`Create new ${createLabel.toLowerCase()}`}
          className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-md text-sm transition duration-200 hover:scale-105 hover:brightness-90"
        >
          <FaPlus size={14} />
          Create {createLabel}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
