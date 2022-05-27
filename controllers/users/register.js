const { hashSync } = require("bcrypt");
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
      name: Joi.string().required().messages({
        "string.base": "Name must be a type of string",
        "any.required": "Please insert user name",
      }),
      email: Joi.string().email().required().messages({
        "string.base": "Email must be a type of string",
        "string.email": "Email must be an active email",
        "any.required": "Please insert email !",
      }),
      password: Joi.string().min(8).required({
        "string.base": "Password must be a type of string",
        "any.required": "Please insert your password",
        "string.min": "Password length must be greather than 8 character",
      }),
      profession: Joi.string().messages({
        "string.base": "User profession must be a type of string",
      }),
      avatar: Joi.number().messages({
        "number.base": "Avatar must be a type of integer!",
      }),
      phoneNumber: Joi.string().messages({
        "string.base": "Phone number must be a type of string",
      }),
    });

    const validate = scheme.validate(req.body);

    if (validate.error)
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
      });

    const { name, email, password, profession, avatar, phoneNumber } = req.body;

    const checkUser = await User.findOne({ where: { email } });

    if (checkUser)
      return res.status(409).json({
        status: "error",
        message: "Email already registered!",
      });

    const hashedPassword = hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await UserProfile.create({
      userId: user.id,
      profession,
      avatar,
      phoneNumber,
    });

    return res.status(201).json({
      status: "created",
      data: { id: user.id },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
