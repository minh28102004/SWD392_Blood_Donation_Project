const getColSpanClass = (colSpan) => {
  switch (colSpan) {
    case 1:
      return "col-span-1";
    case 2:
      return "col-span-2";
    case 3:
      return "col-span-3";
    case 4:
      return "col-span-4";
    default:
      return "col-span-1";
  }
};

const FormRow = ({ columns = 2, children }) => {
  let gridColsClass = "md:grid-cols-2";

  if (columns === 1) gridColsClass = "md:grid-cols-1";
  if (columns === 2) gridColsClass = "md:grid-cols-2";
  if (columns === 3) gridColsClass = "md:grid-cols-3";
  if (columns === 4) gridColsClass = "md:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>{children}</div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  colSpan = 1,
  register,
  required,
  validation = {},
  error,
}) => (
  <div className={getColSpanClass(colSpan)}>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
    >
      {required && <span className="text-orange-500">*</span>} {label} :
    </label>
    <input
      id={name}
      type={type}
      {...(register && register(name, validation))}
      required={required}
      aria-invalid={!!error}
      className={`h-10 w-full px-4 py-2 border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
      hover:border-blue-500 focus:border-blue-600 dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200`}
    />
    {error && (
      <p className="text-sm text-red-500 mt-1">{error.message || error}</p>
    )}
  </div>
);

const SelectField = ({
  label,
  name,
  options = [],
  colSpan = 1,
  register,
  required,
  validation = {},
  error,
}) => (
  <div className={getColSpanClass(colSpan)}>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
    >
      {required && <span className="text-orange-500">*</span>} {label} :
    </label>
    <select
      id={name}
      {...(register && register(name, validation))}
      required={required}
      aria-invalid={!!error}
      className={`h-10 w-full px-4 border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
      hover:border-blue-500 focus:border-blue-600 dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200`}
    >
      <option value="" disabled hidden>
        Select
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-sm text-red-500 mt-1">{error.message || error}</p>
    )}
  </div>
);

const TextAreaField = ({
  label,
  name,
  colSpan = 1,
  register,
  required,
  validation = {},
  rows = 3,
  error,
}) => (
  <div className={getColSpanClass(colSpan)}>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
    >
      {required && <span className="text-orange-500">*</span>} {label} :
    </label>
    <textarea
      id={name}
      rows={rows}
      {...(register && register(name, validation))}
      required={required}
      aria-invalid={!!error}
      className={`w-full px-4 py-2 border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
      hover:border-blue-500 focus:border-blue-600 dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200`}
    ></textarea>
    {error && (
      <p className="text-sm text-red-500 mt-1">{error.message || error}</p>
    )}
  </div>
);

export { FormRow, InputField, SelectField, TextAreaField };
