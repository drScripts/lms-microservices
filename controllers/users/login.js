const { compareSync } = require("bcrypt");
const { request, response } = require("express");
const Joi = require("joi");
const { User } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "User email must be a type of string",
        "string.email": "User email must be an active email",
        "any.required": "Please insert user email!",
      }),
      password: Joi.string().required().messages({
        "string.base": "User password must be a type of string",
        "any.required": "Please insert user password",
      }),
    });

    const validate = scheme.validate(req.body);

    if (validate.error)
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
      });

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: "profile",
    });

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "Can't find user with that email!",
      });

    const isSamePass = compareSync(password, user.password);

    if (!isSamePass)
      return res.status(400).json({
        status: "error",
        message: "Wrong password or email",
      });

    res.send({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.profile.avatar,
          phoneNumber: user.profile.phoneNumber,
          profession: user.profile.profession,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
