import { FaExclamationCircle } from "react-icons/fa"; // FontAwesome exclamation circle icon

const ErrorMessage = ({ message = "Something went wrong" }) => {
  return (
    <div className="flex items-center justify-center space-x-2 ">
      <FaExclamationCircle className="h-6 w-6 text-red-600" />
      <p className="text-lg font-medium text-red-600">
        {typeof message === "object" ? JSON.stringify(message) : message}
      </p>
    </div>
  );
};

export default ErrorMessage;
