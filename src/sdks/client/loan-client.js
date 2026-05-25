import axios from "axios";

const apiUrl = process.env.REACT_APP_LOAN_BASE_URL;
const apiKey = process.env.REACT_APP_API_KEY;

export const loanClient = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    "X-API-Key": apiKey,
    "Content-Type": "application/json",
  },
});

loanClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  },
);
