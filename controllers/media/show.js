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
    const { id } = req.params;
    const resApi = await axios(mediaServiceUrl)
      .get(`/${id}`)
      .catch((err) => err.response);

    if (resApi.status == 500)
      return res.status(500).json({
        status: "error",
        message: "Media services is not available",
      });

    return res.status(resApi.status).json(resApi.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
