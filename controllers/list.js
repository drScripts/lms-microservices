const { request, response } = require("express");
const { Media } = require("../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const media = await Media.findAll();

    return res.send({
      status: "success",
      data: { media },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
