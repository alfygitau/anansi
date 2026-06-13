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

export const deleteGuarantor = async (appId, guarantorId) => {
  try {
    const response = await loanClient.delete(
      `/loan-applications/${appId}/guarantors/${guarantorId}`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const commitGuarantors = async (appId) => {
  try {
    const response = await loanClient.patch(
      `/loan-applications/${appId}/guarantors/commit`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
