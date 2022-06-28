const { request, response } = require("express");
const { courseServiceUrl } = require("../../config");
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
    const body = req.body;

    const { status, data } = await axios(courseServiceUrl).patch(
      `/api/lessons/${id}`,
      body
    );

    res.status(status).json(data);
  } catch (err) {
    if (err?.code === "ECONNREFUSED")
      return res.status(500).json({
        status: "error",
        message: "Course Service Are Not Available!",
      });

    if (err?.response)
      return res.status(err?.response?.status).json(err?.response?.data);
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};