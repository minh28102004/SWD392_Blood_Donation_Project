const ErrorMessage = ({ message = "Something went wrong" }) => {
  return <p className="text-red-500 text-center">{message}</p>;
};

export default ErrorMessage;
