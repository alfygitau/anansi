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
  requestId,
  amount,
  reason,
  decision,
  customerId,
) => {
  try {
    const response = await loanClient.patch(
      `/loan-applications/guarantor-requests/${requestId}/respond?customer_id=${customerId}`,
      {
        decision: decision,
        amount_guaranteed: amount,
        reason: reason,
      },
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
