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
