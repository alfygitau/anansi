import { loanClient } from "../client/loan-client";

export const getLoanApplications = async (customerId) => {
  try {
    const response = await loanClient.get(
      `/loan-applications?customer_id=${customerId}&loan_org_code=BA208`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
