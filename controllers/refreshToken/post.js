const { request, response } = require("express");
const Joi = require("joi");
const { RefreshToken, User } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      token: Joi.string().required().messages({
        "string.base": "Token must be a type of string",
        "any.required": "Please insert user token",
      }),
      userId: Joi.number().required().messages({
        "number.base": "User id must be a type of number",
        "any.required": "Please insert user id",
      }),
    });

    const validate = scheme.validate(req.body);

    if (validate.error)
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
      });

    const { userId, token } = req.body;

    const user = await User.findByPk(userId);

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "Can't find user by that userid",
      });

    const refreshToken = await RefreshToken.create({ userId, token });

    return res.status(201).json({
      status: "created",
      data: { refreshToken },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
