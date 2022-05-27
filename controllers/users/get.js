const { request, response } = require("express");
const { userServiceUrl } = require("../../config");
const { getJwToken, getRefreshToken, getImageMedia } = require("../../helpers");
const axios = require("../../services/apiAdapter");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.user;

    const resApi = (await axios(userServiceUrl).get(`/${id}`)).data.data.user;

    if (resApi.avatar) {
      const avatar = await getImageMedia(resApi.avatar);
      resApi.avatar = avatar;
    }

    return res.send({
      status: "success",
      data: {
        user: resApi,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.code == "ECONNREFUSED")
      return res.status(500).json({
        status: "error",
        message: "User service is not available",
      });

    if (!err.response)
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });

    const { status, data } = err.response;

    return res.status(status).json(data);
  }
};
