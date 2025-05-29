const FormRow = ({ columns = 2, children }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
    {children}
  </div>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      <span className="text-orange-500">*</span> {label} :
    </label>
    <input
      {...props}
      className="h-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
  hover:border-blue-500 focus:border-blue-600 dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200"
    />
  </div>
);

const SelectField = ({ label, name, options = [], ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      <span className="text-orange-500">*</span> {label} :
    </label>
    <select
      name={name}
      {...props}
      className="h-10 w-full px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
hover:border-blue-500 focus:border-blue-600 dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200"
    >
      <option value="" disabled hidden>
        Select
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);


const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      <span className="text-orange-500">*</span> {label} :
    </label>
    <textarea
      {...props}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
  hover:border-blue-500 focus:border-blue-600 dark:hover:border-white  focus:outline-none focus:ring-1 transition-all duration-200"
    ></textarea>
  </div>
);

export {FormRow,InputField,SelectField,TextAreaField};
