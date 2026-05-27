import { loanClient } from "../client/loan-client";

export const searchGuarantor = async (query) => {
  try {
    const response = await loanClient.get(
      `/members/search?q=${query}&org_code=BA208`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
