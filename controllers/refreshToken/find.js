const { request, response } = require("express");
const { RefreshToken } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { refreshtkn } = req.params;

    const refreshToken = await RefreshToken.findOne({
      where: { token: refreshtkn },
    });

    if (!refreshToken)
      return res.status(404).json({
        status: "error",
        message: "Can't find refresh token with that token",
      });

    return res.send({
      status: "success",
      data: { refreshToken },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
