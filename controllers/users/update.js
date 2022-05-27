const { request, response } = require("express");
const Joi = require("joi");
const { User, UserProfile } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      name: Joi.string().messages({
        "string.base": "User name must be a type of string",
      }),
      phoneNumber: Joi.string().messages({
        "string.base": "User phone number must be a type of string",
      }),
      profession: Joi.string().messages({
        "string.base": "User profession must be a type of string",
      }),
      avatar: Joi.number().messages({
        "number.base": "User avatar must be a type of number",
      }),
    });

    const validate = scheme.validate(req.body);
    if (validate.error)
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
      });

    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: "profile",
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "Can't find user with that id",
      });

    const { name, phoneNumber, profession, avatar } = req.body;

    await user.update({
      name,
    });

    await UserProfile.update(
      { phoneNumber, profession, avatar },
      { where: { userId: user.id } }
    );

    const newUser = await User.findByPk(id, { include: "profile" });

    return res.status(201).json({
      status: "created",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phoneNumber: newUser.profile.phoneNumber,
          profession: newUser.profile.profession,
          avatar: newUser.profile.avatar,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
