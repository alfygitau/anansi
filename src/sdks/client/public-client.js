import axios from "axios";

function publicHttpClient(baseURL) {
  return axios.create({
    baseURL,
    timeout: 10000,
  });
}

const apiUrl = process.env.REACT_APP_API_BASE_URL;
export const publicClient = publicHttpClient(apiUrl);
