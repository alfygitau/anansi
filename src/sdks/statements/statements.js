import { client } from "../client/client";

export const fetchStatements = async (year, account) => {
  try {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (account) params.append("account_id", account);
    const queryString = params.toString();
    const url = queryString ? `/statement?${queryString}` : "/statement";

    const response = await client.get(url);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const generateStatement = async (account, duration) => {
  try {
    const response = await client.post(`/statement`, {
      account_id: account,
      duration: duration,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
