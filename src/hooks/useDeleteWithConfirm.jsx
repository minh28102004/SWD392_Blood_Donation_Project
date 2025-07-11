import { useState, useEffect, useRef } from "react";
import { Modal } from "antd";

/**
 * Custom hook to handle delete actions with confirmation modal and skip option.
 * @param {string} sessionKey - Unique sessionStorage key to remember skip preference.
 * @param {string} title - Modal title.
 * @param {string} content - Modal content message.
 * @returns {(deleteFunc: () => Promise<void>) => void}
 */
export const useDeleteWithConfirm = (sessionKey, title, content) => {
  const [skipConfirm, setSkipConfirm] = useState(false);
  const tempSkipRef = useRef(false);

  useEffect(() => {
    // Reset session key on page reload
    sessionStorage.removeItem(sessionKey);
    setSkipConfirm(false);
  }, []); // chỉ chạy 1 lần khi trang load lại

  const confirmDelete = async (deleteFunc) => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved === "true") {
      await deleteFunc();
      return;
    }

    Modal.confirm({
      title,
      content: (
        <div>
          <p>{content}</p>
          <label className="mt-2 inline-flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => {
                tempSkipRef.current = e.target.checked;
              }}
            />
            Don’t show this confirmation again
          </label>
        </div>
      ),
      okText: "OK",
      cancelText: "Cancel",
      style: { top: "30%" },
      onOk: async () => {
        await deleteFunc();
        if (tempSkipRef.current) {
          sessionStorage.setItem(sessionKey, "true");
          setSkipConfirm(true);
        }
      },
    });
  };

  return confirmDelete;
};
