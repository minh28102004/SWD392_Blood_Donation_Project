import { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, formatDistanceToNow } from "date-fns";
import { FiBell } from "react-icons/fi";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import {
  fetchNotifications,
  setNotificationCurrentPage,
  markNotificationAsRead,
  deleteNotification,
  setShouldReloadList,
} from "@redux/features/notificationSlice";
import { fetchAllNotifications } from "@services/RouteApp/fetchAllNotifications ";
import { Transition } from "@headlessui/react";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useDeleteWithConfirm } from "@hooks/useDeleteWithConfirm";
import useOutsideClick from "@hooks/useOutsideClick";

const Notification = ({ user }) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const {
    notificationList,
    currentPage,
    totalPages,
    pageSize,
    loading,
    shouldReloadList,
  } = useSelector((state) => state.notification);

  // Fetch when dropdown opens
  useEffect(() => {
    if (user?.userId && isOpen) {
      dispatch(
        fetchNotifications({ userId: user.userId, page: currentPage, pageSize })
      );
    }
  }, [dispatch, user?.userId, isOpen, currentPage, pageSize]);

  // Auto-fetch when Redux flag is set
  useEffect(() => {
    if (user?.userId && shouldReloadList) {
      dispatch(
        fetchNotifications({ userId: user.userId, page: currentPage, pageSize })
      );
      dispatch(setShouldReloadList(false));
    }
  }, [dispatch, shouldReloadList, user?.userId, currentPage, pageSize]);

  // Fetch total unread count (no matter dropdown state)
  useEffect(() => {
    if (user?.userId) {
      fetchAllNotifications(user.userId).then((allNoti) => {
        const unread = allNoti.filter((n) => n.status === "Unread").length;
        setUnreadCount(unread);
      });
    }
  }, [user?.userId, notificationList]);

  useOutsideClick(dropdownRef, () => setIsOpen(false), isOpen);

  const handleMarkAsRead = (id, status) => {
    dispatch(markNotificationAsRead({ id, status }));
  };

  const confirmDeleteNotification = useDeleteWithConfirm(
    "skipDeleteNotificationConfirm",
    "Are you sure you want to delete this message?",
    "Note: The message will be removed from the list"
  );

  const handleDelete = (id) => {
    confirmDeleteNotification(async () => {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Message has been deleted!");
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Error":
        return <FaExclamationCircle className="text-red-500" />;
      case "Warning":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "DonationRequest":
        return <FaCheckCircle className="text-green-500" />;
      case "BloodRequest":
        return <FaCheckCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBorderColor = (type) => {
    if (type === "DonationRequest") return "border-green-500";
    if (type === "BloodRequest") return "border-red-500";
    return "border-blue-500";
  };

  const getBackgroundColor = (type, status) => {
    if (status !== "Unread") return "bg-gray-50 dark:bg-gray-900 ";
    if (type === "DonationRequest") return "bg-green-50 dark:bg-green-900/30";
    if (type === "BloodRequest") return "bg-rose-50 dark:bg-red-900/30";
    return "bg-blue-100 dark:bg-blue-900/30";
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "MMMM d, yyyy, hh:mm a");
  };

  const getRelativeTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setNotificationCurrentPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setNotificationCurrentPage(currentPage + 1));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip title="Notifications" arrow>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full bg-gray-100 hover:brightness-90 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none group"
          aria-label="Notifications"
        >
          <FiBell className="text-gray-600 dark:text-white text-xl transition-transform group-hover:scale-110 group-hover:rotate-12" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </button>
      </Tooltip>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95 -translate-y-2"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 -translate-y-2"
      >
        <div className="absolute right-0 w-96 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Notifications
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {unreadCount} unread
              </span>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-300">
                Loading...
              </div>
            ) : notificationList.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-300">
                No notifications
              </div>
            ) : (
              notificationList.map((n) => (
                <div
                  key={n.notificationId}
                  onClick={() => handleMarkAsRead(n.notificationId, "Read")}
                  className={`flex items-start p-4 my-0.5 cursor-pointer justify-between transition-all duration-200
                    ${getBackgroundColor(n.type, n.status)} hover:brightness-95
                    border-l-4 ${getBorderColor(n.type)}`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 p-1">
                      {getTypeIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{formatTimestamp(n.sentAt)}</span>
                        <span>{getRelativeTime(n.sentAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Tooltip title="Delete this message" placement="right">
                    <button
                      onClick={() => handleDelete(n.notificationId)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                    >
                      <RiDeleteBinLine className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              ))
            )}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex justify-end px-4 py-1.5">
            <button
              className="px-3 py-1 border border-blue-100 dark:border-gray-500 text-sm text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-white bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow transition-all duration-200"
              onClick={() => {
                // TODO: implement mark all as read API
              }}
            >
              Mark all as read
            </button>
          </div>

          <div className="px-2 py-1.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-full shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="w-3 h-3" /> Prev
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-full shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Notification;
