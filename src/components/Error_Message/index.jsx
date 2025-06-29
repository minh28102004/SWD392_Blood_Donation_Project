import { FaExclamationCircle } from "react-icons/fa";

const ErrorMessage = ({ message = "Something went wrong" }) => {
  // Xử lý nếu message là object (ví dụ: API error)
  const parsedMessage =
    typeof message === "string"
      ? message
      : message?.message || message?.title || "An unexpected error occurred.";

  return (
    <div className="flex items-center justify-center space-x-2">
      <FaExclamationCircle className="h-6 w-6 text-red-600" />
      <p className="text-lg font-medium text-red-600">{parsedMessage}</p>
    </div>
  );
};

export default ErrorMessage;
