const { request, response } = require("express");
const Joi = require("joi");
const { maxFileSize } = require("../config");
const { Media } = require("../models");
const { postImage } = require("../helpers/cloudinary");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      description: Joi.string().allow(null, "").messages({
        "string.base": "Description must be a type of string",
      }),
    });

    const validate = scheme.validate(req.body);

    if (validate.error)
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
      });

    const file = req.file;
    if (!file)
      return res.status(400).json({
        status: "error",
        message: "Please Insert Image FIle",
      });

    const maxSizeBytes = maxFileSize * 1048576;

    if (file.size > maxSizeBytes)
      return res.status(400).json({
        status: "error",
        message: `Max File Size Of Image file is ${maxFileSize} MB`,
      });

    const { description } = req.body;

    const resCloud = await postImage(file.path);

    const media = await Media.create({
      description,
      publicId: resCloud.public_id,
      path: resCloud.secure_url,
    });

    return res.status(201).json({
      status: "created",
      data: { media },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
