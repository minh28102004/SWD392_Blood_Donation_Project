import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const baseClass = `border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
  text-black dark:text-white rounded-lg hover:border-blue-500 focus:border-blue-600 
  dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200`;

export function TextInput({
  label,
  register,
  name,
  errors,
  validation,
  placeholder,
  icon: Icon,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 relative">
      {label}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400 dark:text-gray-400">
            <Icon />
          </div>
        )}
        <input
          type="text"
          {...register(name, validation)}
          placeholder={placeholder}
          className={`${baseClass} mt-1 block w-full px-2 py-1.5 h-9 ${
            Icon ? "pl-8" : ""
          } ${errors[name] ? "border-red-500 dark:border-red-400" : ""}`}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name].message}
        </p>
      )}
    </label>
  );
}
export function Checkbox({ label, register, name, errors, validation }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          {...register(name, validation)}
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 ${
            errors[name] ? "border-red-500 ring-red-500" : ""
          }`}
        />
        <span>{label}</span>
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name].message}
        </p>
      )}
    </label>
  );
}

export function PasswordInput({
  label,
  register,
  name,
  errors,
  validation,
  placeholder,
  icon: Icon,
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 relative">
      {label}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400 dark:text-gray-400">
            <Icon />
          </div>
        )}
        <input
          type={show ? "text" : "password"}
          {...register(name, validation)}
          placeholder={placeholder}
          className={`${baseClass} mt-1 block w-full px-2 py-1.5 pr-10 h-9 ${
            Icon ? "pl-8" : ""
          } ${errors[name] ? "border-red-500 dark:border-red-400" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-700"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name].message}
        </p>
      )}
    </label>
  );
}

export function SelectInput({
  label,
  register,
  name,
  errors,
  options,
  validation,
  placeholder,
  icon: Icon,
  disabled,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 relative">
      {label}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400 dark:text-gray-400">
            <Icon />
          </div>
        )}
        <select
          {...register(name, validation)}
          className={`${baseClass} mt-1 block w-full px-2 py-1.5 h-9 ${
            Icon ? "pl-8" : ""
          } ${errors[name] ? "border-red-500 dark:border-red-400" : ""}`}
          defaultValue=""
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name].message}
        </p>
      )}
    </label>
  );
}

export function DateInput({
  label,
  register,
  name,
  errors,
  validation,
  max,
  icon: Icon,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 relative">
      {label}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400 dark:text-gray-400">
            <Icon />
          </div>
        )}
        <input
          type="date"
          {...register(name, validation)}
          max={max}
          className={`${baseClass} mt-1 block w-full px-2 py-1.5 h-9 ${
            Icon ? "pl-8" : ""
          } ${errors[name] ? "border-red-500 dark:border-red-400" : ""}`}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name].message}
        </p>
      )}
    </label>
  );
}

export function TextAreaInput({
  label,
  register,
  name,
  errors,
  validation,
  rows = 3,
  placeholder,
  icon: Icon,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 relative">
      {label}
      <div className="relative">
        {Icon && (
          <div className="absolute top-2 left-2 flex items-start pointer-events-none text-gray-400 dark:text-gray-400">
            <Icon />
          </div>
        )}
        <textarea
          {...register(name, validation)}
          rows={rows}
          placeholder={placeholder}
          className={`${baseClass} mt-1 block w-full px-2 py-1.5 min-h-[80px] resize-y ${
            Icon ? "pl-8" : ""
          }`}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name].message}
        </p>
      )}
    </label>
  );
}

export function NumberInput({
  label,
  register,
  name,
  errors,
  validation,
  placeholder,
  icon: Icon,
  step = "any",
  min,
  max,
}) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 relative">
      {label}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-400 dark:text-gray-400">
            <Icon />
          </div>
        )}
        <input
          type="number"
          {...register(name, validation)}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          className={`${baseClass} mt-1 block w-full px-2 py-1.5 h-9 ${
            Icon ? "pl-8" : ""
          } ${errors[name] ? "border-red-500 dark:border-red-400" : ""}`}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name].message}
        </p>
      )}
    </label>
  );
}
