const { request, response } = require("express");
const axios = require("../../services/apiAdapter");
const { courseServiceUrl } = require("../../config");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, status } = await axios(courseServiceUrl).get(
      `/api/mentors/${id}`
    );

    return res.status(status).json(data);
  } catch (err) {
    if (err?.code === "ECONNREFUSED")
      return res.status(500).json({
        status: "error",
        message: "Course Service Are Not Available!",
      });
    if (err?.response)
      return res.status(err?.response?.status).json({
        status: "error",
        message: err?.response?.data?.message,
      });

    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
