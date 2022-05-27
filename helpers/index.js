const { sign } = require("jsonwebtoken");
const {
  jwtAppSecret,
  jwtAppExpired,
  jwtAppSecretRefresh,
  jwtAppExpiredRefresh,
  mediaServiceUrl,
} = require("../config");
const axios = require("../services/apiAdapter");

const getJwToken = (data) => {
  return sign(data, jwtAppSecret, {
    expiresIn: jwtAppExpired,
  });
};

const getRefreshToken = (data) => {
  return sign(data, jwtAppSecretRefresh, {
    expiresIn: jwtAppExpiredRefresh,
  });
};

const getImageMedia = async (mediaId) => {
  return (await axios(mediaServiceUrl).get(`/${mediaId}`)).data.data.media;
};

module.exports = { getJwToken, getRefreshToken, getImageMedia };
