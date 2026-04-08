import { client } from "../client/client";

export const getGuarantorRequests = async () => {
  try {
    const response = await client.get(`/guarantors/guarantor-requests`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getGuarantorshipSummary = async () => {
  try {
    const response = await client.get(`/guarantors/eligibility`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
