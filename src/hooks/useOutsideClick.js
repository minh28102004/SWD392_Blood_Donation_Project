import { useEffect } from "react";

const useOutsideClick = (ref, onClose, isOpen) => {
  useEffect(() => {
    if (!isOpen) return; // Do nothing if modal is not open

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose(); // Close modal if click is outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClose, isOpen]); 
};

export default useOutsideClick;
