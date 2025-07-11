import axios from "axios";

const VN_APP_BASE = "https://api.vnappmob.com/api/v2/province/";

// Lấy danh sách tỉnh/thành phố
const fetchProvinces = async () => {
  try {
    const res = await axios.get(`${VN_APP_BASE}`);
    return res.data.results;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Lấy danh sách quận/huyện theo provinceId
const fetchDistricts = async (provinceId) => {
  try {
    const res = await axios.get(`${VN_APP_BASE}district/${provinceId}`);
    return res.data.results;
  } catch (error) {
    console.error(
      `Error fetching districts for provinceId ${provinceId}:`,
      error
    );
    throw error;
  }
};

// Lấy danh sách phường/xã theo districtId
const fetchWards = async (districtId) => {
  try {
    const res = await axios.get(`${VN_APP_BASE}ward/${districtId}`);
    return res.data.results;
  } catch (error) {
    console.error(`Error fetching wards for districtId ${districtId}:`, error);
    throw error;
  }
};

export { fetchProvinces, fetchDistricts, fetchWards };
