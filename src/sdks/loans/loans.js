import { client } from "../client/client";
import { loanClient } from "../client/loan-client";

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

export const getLoanProducts = async () => {
  try {
    const response = await loanClient.get(`/loan-products?org_code=BA208`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getLoanProduct = async (id) => {
  try {
    const response = await loanClient.get(`/loan-products/${id}`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getLoans = async (customerId) => {
  try {
    const response = await loanClient.get(
      `/loans?customer_id=${customerId}&loan_org_code=BA208&format=full`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getLoan = async (loanId) => {
  try {
    const response = await loanClient.get(`/loans/${loanId}?format=full`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
