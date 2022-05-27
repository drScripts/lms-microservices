const axios = require("axios");

module.exports = (baseURL, { timeout = 5000 }) => {
  const api = new axios.Axios({
    baseURL: baseURL,
    timeout,
  });

  return api;
};
