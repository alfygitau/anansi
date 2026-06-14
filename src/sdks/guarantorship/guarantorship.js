import { client } from "../client/client";
import { loanClient } from "../client/loan-client";

export const getGuarantorRequests = async (customerId) => {
  try {
    const response = await loanClient.get(
      `/loan-applications/guarantor-requests?customer_id=${customerId}`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getGuarantorshipSummary = async (customerId) => {
  try {
    const response = await loanClient.get(
      `/loan-applications/guarantorship/eligibility?customer_id=${customerId}`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const acceptGuarantorRequest = async (
  guarantor,
  requestor,
  amount,
  reason,
  status,
) => {
  try {
    const response = await loanClient.post(
      `/guarantors/${guarantor}/respond/${requestor}`,
      {
        isAccepted: true,
        status: status,
        amountGuaranteed: amount,
        responseReason: reason,
      },
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
