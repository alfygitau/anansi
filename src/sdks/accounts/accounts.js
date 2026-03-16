import { client } from "../client/client";

export const createAccountSavings = async (firstname, lastname, id) => {
  try {
    const response = await client.post(`/account`, {
      name: firstname + " " + lastname,
      account_type_id: "1",
      user_id: id,
      branch_id: "71cbca39-4872-48fa-9129-c4ef3b20fb21",
      last_access: new Date().toISOString().slice(0, 19).replace("T", " "),
      product_id: "eab1ba28-4867-4762-a3aa-ab5d6e557482",
      customer_id: id,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const createAccountShares = async (firstname, lastname, id) => {
  try {
    const response = await client.post(`/account`, {
      name: firstname + " " + lastname,
      account_type_id: "1",
      user_id: id,
      branch_id: "71cbca39-4872-48fa-9129-c4ef3b20fb21",
      last_access: new Date().toISOString().slice(0, 19).replace("T", " "),
      product_id: "1f30885f-15d3-47b3-91e4-dda7013a9fcc",
      customer_id: id,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const fetchAccounts = async () => {
  try {
    const response = await client.get(`/account/customer`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const fetchAccount = async (accountId) => {
  try {
    const response = await client.get(`/account/${accountId}`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const fetchAccountTransactions = async (accountNumber) => {
  try {
    const response = await client.get(`/transaction/account/${accountNumber}`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const buyShares = async (
  sharesAmount,
  reference,
  sharesAccountId,
  mobile,
) => {
  try {
    const response = await client.post(`/transaction/deposit`, {
      amount: Number(sharesAmount),
      ref_number: reference,
      account_id: String(sharesAccountId),
      mpesa_msisdn: mobile.startsWith("0")
        ? mobile.replace("0", "254")
        : mobile.replace("+", ""),
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const buySavings = async (
  savingsAmount,
  reference,
  savingsAccountId,
  mobile,
) => {
  try {
    const response = await client.post(`/transaction/deposit`, {
      amount: Number(savingsAmount),
      ref_number: reference,
      account_id: String(savingsAccountId),
      mpesa_msisdn: mobile.startsWith("0")
        ? mobile.replace("0", "254")
        : mobile.replace("+", ""),
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const investAndSave = async (
  savingsAmount,
  sharesAmount,
  reference,
  id,
  mobile,
) => {
  try {
    const response = await client.post(`/transaction/shares-savings-deposit`, {
      category: "credit",
      type: "deposit",
      ref_number: reference,
      customer_id: id,
      sharesAmount: Number(sharesAmount),
      savingsAmount: Number(savingsAmount),
      phone_number: mobile.startsWith("0")
        ? mobile.replace("0", "+254")
        : mobile.startsWith("254")
          ? "+" + mobile
          : mobile,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const confirmSharesPayment = async (reference, sharesAccountId) => {
  try {
    const response = await client.get(
      `/transaction/has-completed-transaction/${sharesAccountId}/${reference}`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const confirmQuickInvest = async (reference) => {
  try {
    const response = await client.get(
      `/transaction/has-completed-quicktrans/${reference}`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const confirmDepositPayment = async (reference, savingsAccountId) => {
  try {
    const response = await client.get(
      `/transaction/has-completed-transaction/${savingsAccountId}/${reference}`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getSharesSummary = async (public_id) => {
  try {
    const response = await client.get(`/shares/member/${public_id}/summary`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
