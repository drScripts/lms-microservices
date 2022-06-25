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

    const { data, status } = await axios(courseServiceUrl).patch(
      `/api/mentors/${id}`,
      body
    );

    return res.status(status).json(data);
  } catch (err) {
    if (err?.code === "ECONNREFUSED")
      return res.status(500).json({
        status: "error",
        message: "Course Service Are Not Available!",
      });

    console.log(err?.response);
    if (err?.response)
      return res.status(err?.response?.status).json({
        status: "error",
        message: err?.response?.data?.message || err?.response?.data?.messages,
      });

    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
