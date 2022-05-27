const { request, response } = require("express");
const { deleteImage } = require("../helpers/cloudinary");
const { Media } = require("../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { id, force } = req.params;

    const media = await Media.findByPk(id);

    if (!media)
      return res.status(404).json({
        status: "error",
        message: "Can't find media with that id",
      });

    if (force) {
      deleteImage(media.publicId);
      media.destroy({
        force: true,
      });
    } else {
      media.destroy();
    }

    return res.status(201).json({
      status: "created",
      message: "Successfully delete media!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
