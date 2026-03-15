import { client } from "../client/client";

export const uploadSingleFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await client.post("/file-upload", formData);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const extractIdDetails = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await client.post("/kyc-validation/kenya-id", formData);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const extractPassportDetails = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await client.post("/kyc-validation/passport", formData);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const extractBackIdDetails = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await client.post(
      "/kyc-validation/kenya-id/back",
      formData,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
