import React from "react";

const sizeMap = {
  4: "w-4 h-4",
  6: "w-6 h-6",
  8: "w-8 h-8",
  10: "w-10 h-10",
  12: "w-12 h-12",
};

const colorMap = {
  blue: "border-blue-500",
  red: "border-red-500",
  green: "border-green-500",
  yellow: "border-yellow-500",
  gray: "border-gray-500",
  white: "border-white",
};

const LoadingSpinner = ({
  color = "blue",
  size = "8",
  inline = false,
  className = "",
}) => {
  const spinner = (
    <div
      className={`${sizeMap[size] || sizeMap["8"]} 
        border-4 
        ${colorMap[color] || colorMap["blue"]} 
        border-t-transparent 
        rounded-full 
        animate-spin 
        ${className}`}
    />
  );

  // Nếu inline thì không wrap, dùng cho trong nút
  if (inline) return spinner;

  // Nếu không, wrap bằng 1 container
  return <div className="flex justify-center items-center h-32">{spinner}</div>;
};

export default LoadingSpinner;
