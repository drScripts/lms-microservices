const { request, response } = require("express");
const { userServiceUrl } = require("../../config");
const { getJwToken, getRefreshToken } = require("../../helpers");
const axios = require("../../services/apiAdapter");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const body = req.body;

    const resApi = await axios(userServiceUrl).post(
      "/login",
      JSON.stringify(body),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = getJwToken(resApi.data.data.user);
    const refreshToken = getRefreshToken({ id: resApi.data.data.user.id });

    axios(userServiceUrl).post(
      "/refresh-tokens",
      JSON.stringify({
        token: refreshToken,
        userId: resApi.data.data.user.id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.send({
      status: "success",
      data: {
        user: resApi.data.data.user,
        token,
        refreshToken,
        tokenType: "Bearer",
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
