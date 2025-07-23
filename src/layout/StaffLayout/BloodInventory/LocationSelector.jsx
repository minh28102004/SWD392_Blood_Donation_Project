import { SelectInput } from "@components/Form_Input";
import { useEffect, useRef, useState } from "react";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
} from "@services/API/locationAPI";

const LocationSelector = ({ setValue, getValues, errors, required = true }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const restoredOnce = useRef(false);

  // Fetch provinces
  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  // Restore location value (once)
  useEffect(() => {
    const raw = getValues("inventoryLocation");
    if (!raw || restoredOnce.current || provinces.length === 0) return;

    setIsRestoring(true);
    const [provinceName, districtName, wardName] = raw
      .split("_")
      .map((s) => s.trim());

    const province = provinces.find((p) => p.province_name === provinceName);
    if (!province) return;

    setSelectedProvince(province);

    fetchDistricts(province.province_id).then((ds) => {
      setDistricts(ds);
      const district = ds.find((d) => d.district_name === districtName);
      if (!district) return;

      setSelectedDistrict(district);

      fetchWards(district.district_id).then((ws) => {
        setWards(ws);
        const ward = ws.find((w) => w.ward_name === wardName);
        if (ward) setSelectedWard(ward);
        setIsRestoring(false);
      });
    });

    restoredOnce.current = true;
  }, [provinces]);

  // Auto-fetch districts when province changes
  useEffect(() => {
    if (selectedProvince && !isRestoring) {
      fetchDistricts(selectedProvince.province_id).then((data) => {
        setDistricts(data);
        const stillValid = data.find(
          (d) => d.district_id === selectedDistrict?.district_id
        );
        if (!stillValid) {
          setSelectedDistrict(null);
          setSelectedWard(null);
          setWards([]);
        }
      });
    }
  }, [selectedProvince]);

  // Auto-fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict && !isRestoring) {
      fetchWards(selectedDistrict.district_id).then((data) => {
        setWards(data);
        const stillValid = data.find(
          (w) => w.ward_id === selectedWard?.ward_id
        );
        if (!stillValid) {
          setSelectedWard(null);
        }
      });
    }
  }, [selectedDistrict]);

  // Set final value when all selected
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const readable = `${selectedWard.ward_name}, ${selectedDistrict.district_name}, ${selectedProvince.province_name}`;
      const machine = `${selectedProvince.province_name}_${selectedDistrict.district_name}_${selectedWard.ward_name}`;
      setValue("readableLocation", readable);
      setValue("inventoryLocation", machine);
      setShowDropdown(false);
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  const placeholder =
    getValues("readableLocation") ||
    "Select location (Province → District → Ward)";

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {required && <span className="text-orange-500">*</span>} Location :
      </label>

      {/* Fake Input Display */}
      <input
        readOnly
        value={getValues("inventoryLocation") || ""}
        name="inventoryLocation"
        onClick={() => setShowDropdown((prev) => !prev)}
        placeholder={placeholder}
        className={`h-10 w-full px-4 py-2 cursor-pointer border ${
          errors?.inventoryLocation
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        } bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg
        hover:border-blue-500 focus:border-blue-600 dark:hover:border-white focus:outline-none focus:ring-1 transition-all duration-200`}
      />

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 mt-1 w-full z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md rounded-lg p-3 ${
          showDropdown ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-2">
          <SelectInput
            label="Province"
            name="province"
            options={[
              { label: "Select Province", value: "" },
              ...provinces.map((p) => ({
                label: p.province_name,
                value: String(p.province_id),
              })),
            ]}
            value={selectedProvince?.province_id?.toString() || ""}
            onChange={(e) => {
              const province = provinces.find(
                (p) => String(p.province_id) === e.target.value
              );
              setSelectedProvince(province || null);
            }}
          />
          <SelectInput
            label="District"
            name="district"
            options={[
              { label: "Select District", value: "" },
              ...districts.map((d) => ({
                label: d.district_name,
                value: String(d.district_id),
              })),
            ]}
            value={selectedDistrict?.district_id?.toString() || ""}
            onChange={(e) => {
              const district = districts.find(
                (d) => String(d.district_id) === e.target.value
              );
              setSelectedDistrict(district || null);
            }}
            disabled={!selectedProvince}
          />
          <SelectInput
            label="Ward"
            name="ward"
            options={[
              { label: "Select Ward", value: "" },
              ...wards.map((w) => ({
                label: w.ward_name,
                value: String(w.ward_id),
              })),
            ]}
            value={selectedWard?.ward_id?.toString() || ""}
            onChange={(e) => {
              const ward = wards.find(
                (w) => String(w.ward_id) === e.target.value
              );
              setSelectedWard(ward || null);
            }}
            disabled={!selectedDistrict}
          />
        </div>
      </div>

      {/* Error Display */}
      {errors?.inventoryLocation && (
        <p className="text-red-500 text-sm mt-1">
          {errors.inventoryLocation.message}
        </p>
      )}
    </div>
  );
};

export default LocationSelector;
