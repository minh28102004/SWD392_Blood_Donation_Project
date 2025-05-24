import axios from "axios";

// Create url base
const api = axios.create({
  baseURL: "https://localhost:7210",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// [GET]
const getRequest = async (url) => {
  const res = await api.get(url);
  return res;
};

// [GET] with params
const getRequestParams = async ({ url, params }) => {
  try {
    const res = await api.get(url, { params });
    return res.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

// [POST] 
const postRequest = async ({ url, data }) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

// [POST] with query params (no body)
const postRequestParams = async ({ url, params }) => {
  try {
    const res = await api.post(url, null, { params });
    return res.data;
  } catch (error) {
    console.error("POST with params error:", error);
    throw error;
  }
};

// [DELETE] 
const deleteRequest = async ({ url }) => {
  try {
    const res = await api.delete(url);
    return res.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

// [DELETE] with query params
const deleteRequestParams = async ({ url, params }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.delete(`${url}?${query}`);
    return res.data;
  } catch (error) {
    console.error("DELETE with params error:", error);
    throw error;
  }
};

// [DELETE] many
const deleteMany = async ({ url, data }) => {
  try {
    const res = await api.delete(url, {
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("DELETE many error:", error);
    throw error;
  }
};

// [PUT] 
const putRequest = async ({ url, data }) => {
  try {
    const res = await api.put(url, data);
    return res.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

// [PUT] with query params
const putRequestParams = async ({ url, params }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.put(`${url}?${query}`);
    return res.data;
  } catch (error) {
    console.error("PUT with params error:", error);
    throw error;
  }
};

// [PATCH]
const patchRequest = async ({ url, data }) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error) {
    console.error("PATCH request error:", error);
    throw error;
  }
};

// [POST] multipart/form-data
const postRequestMultipartFormData = async ({ url, formData }) => {
  try {
    const res = await api.post(url, formData, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("POST multipart error:", error);
    throw error;
  }
};

// [PUT] multipart/form-data
const putRequestMultipartFormData = async ({ url, formData }) => {
  try {
    const res = await api.put(url, formData, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("PUT multipart error:", error);
    throw error;
  }
};

// -------------------------------------------------------
export {
  getRequest,
  getRequestParams,
  postRequest,
  postRequestParams,
  postRequestMultipartFormData,
  deleteRequest,
  deleteRequestParams,
  deleteMany,
  putRequest,
  putRequestParams,
  putRequestMultipartFormData,
  patchRequest,
};
