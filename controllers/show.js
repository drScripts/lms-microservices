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
    const { id } = req.params;

    const media = await Media.findByPk(id);

    if (!media)
      return res.status(404).json({
        status: "error",
        message: "can't find media with that id",
      });

    return res.send({
      status: "success",
      data: { media },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
