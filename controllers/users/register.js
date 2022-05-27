const { request, response } = require("express");
const { userServiceUrl } = require("../../config");
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

    const resApi = await axios(userServiceUrl)
      .post("/register", JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((err) => err.response);

    if (resApi.status == 500)
      return res.status(500).json({
        status: "error",
        message: "User service is not available",
      });

    return res.status(resApi.status).json(resApi.data);
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
