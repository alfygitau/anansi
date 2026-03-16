import { client } from "../client/client";

const generateUniqueId = () => {
  return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
};

export const payMembership = async (
  id,
  membershipShares,
  membershipSavings,
  membershipPhoneNumber,
) => {
  try {
    const response = await client.post(`/transaction/register-shares-save`, {
      category: "credit",
      type: "membership",
      amount: 1000,
      ref_number: generateUniqueId(),
      note: "Membership registration fees",
      customer_id: id,
      membershipAmount: 1000,
      sharesAmount: Number(membershipShares),
      savingsAmount: Number(membershipSavings),
      phone_number: membershipPhoneNumber.startsWith("0")
        ? membershipPhoneNumber.replace("0", "+254")
        : membershipPhoneNumber.startsWith("254")
          ? "+" + membershipPhoneNumber
          : membershipPhoneNumber,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const confirmMembership = async () => {
  try {
    const response = await client.get(`/transaction/has-completed-membership`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateMembership = async (id, status) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      member: true,
      membership: "active",
      status:status
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
