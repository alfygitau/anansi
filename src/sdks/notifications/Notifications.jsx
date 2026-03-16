import { client } from "../client/client";

export const getNotifications = async () => {
  try {
    const response = await client.get(`/notification`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
