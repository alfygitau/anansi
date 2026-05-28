import { loanClient } from "../client/loan-client";

export const addColleteral = async (
  appId,
  asset_name,
  asset_category,
  estimated_value,
  images,
  documents,
) => {
  try {
    const response = await loanClient.post(
      `/loan-applications/${appId}/chattels`,
      {
        asset_name: asset_name,
        asset_category: asset_category,
        estimated_value: estimated_value,
        image_urls: images,
        doc_urls: documents,
      },
    );
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const fetchChattels = async (appId) => {
  try {
    const response = await loanClient.get(
      `/loan-applications/${appId}/chattels`,
    );
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
