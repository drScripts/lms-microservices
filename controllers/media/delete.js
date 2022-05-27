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
    const apiRes = await axios(mediaServiceUrl)
      .delete(`/${id}`)
      .catch((err) => err.response);

    return res.status(apiRes.status).json(apiRes.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
