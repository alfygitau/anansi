import { loanClient } from "../client/loan-client";

export const getLoanApplications = async (customerId, status) => {
  try {
    const params = new URLSearchParams({
      customer_id: customerId,
      loan_org_code: "BA208",
    });

    if (status && status.trim() !== "" && status !== "all") {
      params.append("status", status.trim());
    }

    const response = await loanClient.get(`/loan-applications?${params.toString()}`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getActiveLoanApplications = async (customerId) => {
  try {
    const response = await loanClient.get(
      `/loan-applications/my?customer_id=${customerId}&loan_org_code=BA208`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getLoanApplication = async (id) => {
  try {
    const response = await loanClient.get(`/loan-applications/${id}`);
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

export const acceptLoanTerms = async (applicationId, applicantId) => {
  try {
    const response = await loanClient.patch(
      `/loan-applications/${applicationId}/accept-terms`,
      {
        customer_id: applicantId,
      },
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const createLoanApplication = async (
  customerId,
  loanProductId,
  applicantName,
  applicantMobile,
  amount,
  duration,
  purpose,
) => {
  try {
    const response = await loanClient.post(`/loan-applications`, {
      customer_id: customerId,
      applicant_name: applicantName,
      applicant_mobile: applicantMobile,
      loan_product_id: loanProductId,
      applied_amount: Number(amount),
      loan_period: Number(duration),
      loan_channel: "WEB",
      loan_org_code: "BA208",
      loan_purpose: purpose,
      currency: "KES",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
