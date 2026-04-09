import { client } from "../client/client";

export const getNotifications = async () => {
  try {
    const response = await client.get(`/notification`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const readNotifications = async (id) => {
  try {
    const response = await client.patch(`/notification/${id}`, {
      is_read: true,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
