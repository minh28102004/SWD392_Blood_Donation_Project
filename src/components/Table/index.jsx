const TableComponent = ({ columns, data, darkMode }) => {
  return (
    <div className="overflow-x-auto p-2">
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-red-100 border border-red-50 dark:bg-gray-800">
            {columns.map((col) => (
              <th key={col.key} className="text-center p-3">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={item.id || idx}
              className="border border-red-100 hover:bg-gray-100 dark:hover:bg-gray-700 transform transition duration-200 hover:scale-[1.01]"
            >
              {columns.map((col) => (
                <td key={col.key} className="p-3 text-center">
                  {typeof col.render === "function"
                    ? col.render(item[col.key], item)
                    : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;