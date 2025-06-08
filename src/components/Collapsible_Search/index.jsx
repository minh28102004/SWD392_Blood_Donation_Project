import { useState } from "react";
import { RedoOutlined } from "@ant-design/icons";
import { FaSearch, FaChevronLeft } from "react-icons/fa";
import { Input, Select, DatePicker, Tooltip, TimePicker, Button } from "antd";
import "moment/locale/vi";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const CollapsibleSearch = ({ searchFields, onSearch, onClear }) => {
  const initialSearchValues = searchFields.reduce((searchValues, field) => {
    searchValues[field.key] = "";
    return searchValues;
  }, {});

  const [isOpen, setIsOpen] = useState(false);
  const [searchValues, setSearchValues] = useState(initialSearchValues);

  const handleInputChange = (key, value) => {
    setSearchValues((prevSearchValue) => ({
      ...prevSearchValue,
      [key]: value,
    }));
  };

  const handleClear = () => {
    setSearchValues(initialSearchValues);
    onClear();
  };

  const handleSearchButtonClick = () => {
    onSearch(searchValues);
  };

  return (
    <div className="pt-2 pl-4 flex items-center gap-4 ">
      {/* Collapsible search button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex-shrink-0 bg-blue-600 text-white px-2.5 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
      >
        <FaSearch />
        <span>Search</span>
        <div
          className={`transition-all duration-500 transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <FaChevronLeft />
        </div>
      </button>

      {/* Search inputs */}
      <div
        className={`transition-all ease-in-out duration-700 overflow-hidden ${
          isOpen ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
        }`}
      >
        <div className="shadow-md rounded-md">
          <div className="flex gap-4 ">
            {searchFields.map((field) => {
              switch (field.type) {
                case "select":
                  return (
                    <div key={field.key} className="flex-1 min-w-[200px]">
                      <Select
                        className="w-full"
                        placeholder={field.placeholder}
                        onChange={(value) =>
                          handleInputChange(field.key, value)
                        }
                        value={searchValues[field.key] || undefined}
                        options={field.options}
                        allowClear
                      />
                    </div>
                  );

                case "date":
                  return (
                    <div key={field.key} className="flex-1 min-w-[150px]">
                      <DatePicker
                        className="w-full"
                        placeholder="Chọn ngày"
                        format="YYYY-MM-DD"
                        onChange={(value) =>
                          handleInputChange(
                            field.key,
                            value ? value.format("YYYY-MM-DD") : ""
                          )
                        }
                        value={
                          searchValues[field.key]
                            ? dayjs(searchValues[field.key], "YYYY-MM-DD")
                            : null
                        }
                        disabledDate={(current) =>
                          current && current.isAfter(dayjs())
                        }
                      />
                    </div>
                  );

                case "number":
                  return (
                    <div key={field.key} className="flex-1 min-w-[150px]">
                      <Input
                        type="number"
                        className="w-full"
                        placeholder={field.placeholder}
                        value={searchValues[field.key]}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                      />
                    </div>
                  );

                case "time":
                  return (
                    <div key={field.key} className="flex-1 min-w-[150px]">
                      <TimePicker
                        className="w-full"
                        showNow={false}
                        placeholder={field.placeholder}
                        format="HH:mm"
                        onChange={(value) =>
                          handleInputChange(
                            field.key,
                            value ? value.format("HH:mm") : ""
                          )
                        }
                        value={
                          searchValues[field.key]
                            ? dayjs(searchValues[field.key], "HH:mm")
                            : null
                        }
                      />
                    </div>
                  );

                default:
                  return (
                    <div key={field.key} className="flex-1 min-w-[200px]">
                      <Input
                        className="w-full"
                        placeholder={field.placeholder}
                        value={searchValues[field.key]}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                      />
                    </div>
                  );
              }
            })}
            <div className="flex gap-2">
              {/* Search Button */}
              <Tooltip title="Click to start" color="rgb(117, 117, 117)">
                <button
                  className="flex-shrink-0 min-w-[75px] bg-gradient-to-br from-rose-400 to-red-500 text-white rounded-lg 
        transition-all duration-300 transform hover:brightness-90 hover:scale-105"
                  onClick={handleSearchButtonClick}
                >
                  Search
                </button>
              </Tooltip>

              {/* Clear Button */}
              <Tooltip title="Clear search data" color="rgb(117, 117, 117)">
                <button
                  className="flex-shrink-0 min-w-[35px] bg-[hsl(210,100%,75%)] text-white rounded-lg 
        transition-all duration-300 transform hover:bg-[hsl(210,100%,65%)] hover:scale-105"
                  onClick={handleClear}
                >
                  <RedoOutlined />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CollapsibleSearch.propTypes = {
  searchFields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      key: PropTypes.string,
      placeholder: PropTypes.string,
      options: PropTypes.array,
    })
  ),
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default CollapsibleSearch;
