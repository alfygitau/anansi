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

export const checkEligibility = async (customerId, loanProductId) => {
  try {
    const response = await loanClient.post(
      `/loan-applications/check-eligibility`,
      {
        customer_id: customerId,
        loan_product_id: loanProductId,
      },
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
