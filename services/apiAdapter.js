const axios = require("axios");

/**
 *
 * @param {string} baseURL
 * @param {number} timeout
 * @returns {axios.Axios}
 */
module.exports = (baseURL, timeout = 3000) => {
  const api = new axios.create({
    baseURL: baseURL,
    timeout: timeout,
  });

  return api;
};
