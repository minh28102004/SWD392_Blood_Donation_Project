const LoadingSpinner = ({ color = "blue", size = "8" }) => {
  return (
    <div className="flex justify-center items-center h-32">
      <div
        className={`w-${size} h-${size} border-4 border-${color}-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
