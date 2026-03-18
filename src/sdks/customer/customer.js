import { client } from "../client/client";
import { publicClient } from "../client/public-client";

export const updateCustomerVerification = async (id) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      phoneVerified: true,
      emailVerified: true,
      onboarding_stage: "account-success",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateCustomerStatuses = async (id) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      onboarding_stage: "completed",
      status: "Pending Payment",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateKinStatus = async (id) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      onboarding_stage: "terms-conditions",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const sendWelcomeEmail = async (email) => {
  try {
    const response = await client.patch(`/customer/welcome-email`, {
      email: email,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateSelfie = async (id, selfieUrl) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      selfie_image: selfieUrl,
      onboarding_stage: "personal-information",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateProfilePhoto = async (id, url) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      profile_photo: url,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateCustomerPersonalInformation = async (
  id,
  firstName,
  middleName,
  lastName,
  idNumber,
) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      firstname: firstName,
      middlename: middleName,
      lastname: lastName,
      identification: idNumber,
      onboarding_stage: "facial-identity",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const sendEmailLink = async (email, token) => {
  try {
    const response = await client.post(`/customer/selfie-email`, {
      email: email,
      url: `${process.env.REACT_APP_SELFIE_URL}?token=${token}`,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getCustomer = async () => {
  try {
    const response = await client.get(`/customer/details`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await client.get(`/customer/${id}`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getCustomerDetails = async (token) => {
  try {
    const response = await publicClient.get(`/customer/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getCounties = async () => {
  try {
    const response = await client.get(`/county`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getCountries = async () => {
  try {
    const response = await client.get(`/country`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getStates = async () => {
  try {
    const response = await client.get(`/us-states`);
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const createCustomerAddress = async (
  id,
  physicalAddress,
  county,
  subcounty,
) => {
  try {
    const response = await client.post(`/address`, {
      physical_address: physicalAddress,
      customer_id: id,
      county: county,
      subcounty: subcounty,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateCustomerFinancials = async (
  id,
  employment_type,
  kra,
  jobTitle,
  income,
  country_of_residence,
) => {
  try {
    const response = await client.patch(`/customer/${id}`, {
      onboarding_stage: "nextOfKin",
      country_of_residence: country_of_residence,
      employment_type: employment_type,
      kraPin: kra,
      occupation: jobTitle,
      income_range: income,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const createNextOfKin = async (
  id,
  fullName,
  birthDate,
  relationship,
  phone,
  location,
) => {
  try {
    const response = await client.post(`/customer/${id}/next-of-kin`, {
      name: fullName,
      dateOfBirth: birthDate,
      relationship: relationship,
      phoneNumber: phone,
      location: location,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
