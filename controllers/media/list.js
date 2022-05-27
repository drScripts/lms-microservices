const { request, response } = require("express");
const { mediaServiceUrl } = require("../../config");
const axios = require("../../services/apiAdapter");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const apiRes = await axios(mediaServiceUrl).get();

    return res.status(apiRes.status).json(apiRes.data);
  } catch (err) {
    if (err.code == "ECONNREFUSED")
      return res.status(500).json({
        status: "error",
        message: "Media services is not available!",
      });
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
