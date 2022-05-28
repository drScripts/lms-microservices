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
    const { id: userId } = req.user;

    await axios(userServiceUrl).post("/logout", JSON.stringify({ userId }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.send({
      status: "success",
      messsage: "Successfully Logout!",
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
