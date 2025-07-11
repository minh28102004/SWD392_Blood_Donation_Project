import { postRequest, postRequestMultipartFormData } from "./api";

export const loginAPI = async (formData) => {
  return await postRequestMultipartFormData({
    url: "/api/Auth/login",
    formData,
  });
};

export const registerAPI = async (data) => {
  return await postRequest({ url: "/api/Auth/register", data });
};
