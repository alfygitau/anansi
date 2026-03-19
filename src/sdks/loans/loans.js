import { client } from "../client/client";

export const uploadStatements = async (file, type, password) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("statementCode", password);
    const response = await client.post(`/loan/statements/upload`, formData);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
