import { loanClient } from "../client/loan-client";

export const addApplicationGuarantors = async (appId, name, mobile) => {
  try {
    const response = await loanClient.post(
      `/loan-applications/${appId}/guarantors`,
      {
        phone: mobile,
        name: name,
      },
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const applicationGuarantors = async (appId) => {
  try {
    const response = await loanClient.get(
      `/loan-applications/${appId}/guarantors`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
