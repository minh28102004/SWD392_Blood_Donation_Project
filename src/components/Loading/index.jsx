const sizeMap = {
  '4': 'w-4 h-4',
  '6': 'w-6 h-6',
  '8': 'w-8 h-8',
  '10': 'w-10 h-10',
};

const colorMap = {
  blue: 'border-blue-500',
  red: 'border-red-500',
  green: 'border-green-500',
  // ... thêm màu bạn cần
};

const LoadingSpinner = ({ color = "blue", size = "8" }) => {
  return (
    <div className="flex justify-center items-center h-32">
      <div
        className={`${sizeMap[size] || sizeMap['8']} border-4 ${colorMap[color] || colorMap['blue']} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;