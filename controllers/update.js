const { request, response } = require("express");
const Joi = require("joi");
const { postImage, deleteImage } = require("../helpers/cloudinary");
const { Media } = require("../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      description: Joi.string().messages({
        "string.base": "Media description must be a type of string!",
      }),
    });

    const validate = scheme.validate(req.body);

    if (validate.error)
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
      });

    const { id } = req.params;

    const media = await Media.findByPk(id);

    if (!media)
      return res.status(404).json({
        status: "error",
        message: "Can't find media with that id",
      });

    const file = req.file;

    media.description = req.body.description;

    if (file) {
      if (media.publicId) {
        deleteImage(media.publicId);
      }
      const res = await postImage(file.path);
      media.publicId = res.public_id;
      media.path = res.secure_url;
    }

    await media.save();

    return res.status(201).json({
      status: "created",
      data: { media },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
