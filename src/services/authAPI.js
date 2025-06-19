import { postRequest } from "./api";

export const loginAPI = async (data) => {
  return await postRequest({ url: "/api/Auth/login", data });
};

export const registerAPI = async (data) => {
  return await postRequest({ url: "/api/Auth/register", data });
};
