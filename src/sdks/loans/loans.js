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

export const getLoans = async (customerId, status) => {
  try {
    const params = new URLSearchParams({
      customer_id: customerId,
      loan_org_code: "BA208",
      format: "full",
    });
    if (status && status.trim() !== "" && status !== "all") {
      params.append("status", status);
    }
    const response = await loanClient.get(`/loans?${params.toString()}`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getActiveLoans = async (customerId) => {
  try {
    const response = await loanClient.get(
      `/loans/my?customer_id=${customerId}&loan_org_code=BA208`,
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

export const getLoanStatements = async (customerId) => {
  try {
    const response = await loanClient.get(`/loans/statements?customer_id=${customerId}`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const repayLoan = async (
  loanId,
  amount,
  phone_number,
  account_reference,
  idempotency_key,
) => {
  try {
    const response = await loanClient.post(`/mpesa/loan-repayments/stk-push`, {
      loan_id: loanId,
      amount: 22000,
      phone_number: phone_number,
      org_code: "BA208",
      account_reference: account_reference,
      description: `Loan repayment ${account_reference}`,
      idempotency_key: idempotency_key,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
