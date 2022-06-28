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
    const queries = req.query;
    const { data, status } = await axios(courseServiceUrl).get("/api/lessons", {
      params: queries,
    });

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
