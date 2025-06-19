import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export const InputField = ({
  label,
  icon: Icon,
  iconColor = "text-gray-600 dark:text-gray-300",
  name,
  type = "text",
  value,
  disabled,
  onChange,
  children,
  className = "",
  labelIcon: LabelIcon,
  labelIconColor = "text-gray-600 dark:text-gray-300",
  isPasswordToggle = false,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const computedType = isPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {LabelIcon && (
          <LabelIcon className={`${labelIconColor} h-4 w-4 inline mr-1`} />
        )}
        {label} :
      </label>

      <div className="relative flex items-center">
        {Icon && <Icon className={`${iconColor} mr-2 flex-shrink-0 h-4 w-4`} />}

        {children || (
          <input
            name={name}
            type={computedType}
            value={value}
            disabled={disabled}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-400 rounded-md hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors disabled:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:text-white h-10"
            {...props}
          />
        )}

        {/* Toggle icon nếu là input password */}
        {isPasswordToggle && !children && (
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 cursor-pointer text-gray-500 dark:text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
};
