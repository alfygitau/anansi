import { publicClient } from "../client/public-client";

const formatPhoneNumber = (number) => {
  if (!number) return null;
  number = number.replace(/\D/g, "");

  if (number.startsWith("0")) {
    return "+254" + number.slice(1);
  }

  if (number.startsWith("254")) {
    return "+" + number;
  }

  if (/^(7\d{8}|1\d{8})$/.test(number)) {
    return "+254" + number;
  }
  return null;
};

const getOrCreateDeviceId = () => {
  let id = localStorage.getItem("anansi_device_id");
  if (!id) {
    if (window.crypto?.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16),
      );
    }
    localStorage.setItem("anansi_device_id", id);
    const maxAge = 60 * 60 * 24 * 365 * 5;
    document.cookie = `anansi_device_id=${id}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }

  return id;
};

const getUserAgent = () => {
  if (typeof window !== "undefined" && navigator) {
    return navigator.userAgent;
  }
  return null;
};

export const loginUser = async (email, password) => {
  try {
    const response = await publicClient.post(`/customer/login`, {
      email: email,
      password: password,
      deviceId: getOrCreateDeviceId(),
      userAgent: getUserAgent(),
      platform: "web",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const verifyUser = async (customerId, otp, email, mobileno) => {
  try {
    const response = await publicClient.post(`/customer/otp/verify-login`, {
      code: otp,
      isEmail: false,
      customerId: customerId,
      deviceId: getOrCreateDeviceId(),
      email: email,
      phoneNumber: mobileno,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const resendOtp = async (userId) => {
  try {
    const response = await publicClient.post(`/otp`, {
      userId: userId,
      isEmail: false,
      isMobile: true,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const initRegister = async (username, email, phoneNumber, password) => {
  try {
    const response = await publicClient.post(`/customer`, {
      mobileno: formatPhoneNumber(String(phoneNumber)),
      email: email,
      username: username,
      password: password,
      onboarding_stage: "registration",
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const verifyEmailAddress = async (otp, email) => {
  try {
    const response = await publicClient.post(`/otp/verify-otp`, {
      otp: otp,
      isEmail: true,
      email: email,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const verifyMobile = async (otp, mobile) => {
  try {
    const response = await publicClient.post(`/otp/verify-otp`, {
      otp: otp,
      isEmail: false,
      phoneNumber: mobile,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const sendMobileOtp = async (userId) => {
  try {
    const response = await publicClient.post(`/otp`, {
      userId: userId,
      isEmail: false,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const resendEmailOtp = async (userId) => {
  try {
    const response = await publicClient.post(`/otp`, {
      userId: userId,
      isEmail: true,
    });
    return response;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
