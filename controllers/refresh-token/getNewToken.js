const { request, response } = require("express");
const { userServiceUrl, jwtAppSecretRefresh } = require("../../config");
const { getJwToken } = require("../../helpers");
const axios = require("../../services/apiAdapter");
const Joi = require("joi");
const { verify } = require("jsonwebtoken");

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
        "any.required": "Please Insert user email!",
      }),
      refreshToken: Joi.string().required().messages({
        "string.base": "Refresh token must be a type of string",
        "any.required": "Please insert refreshToken",
      }),
    });

    const validate = scheme.validate(req.body);

    if (validate.error)
      return res.status(400).json({
        status: "errpr",
        message: validate.error.details[0].message,
      });

    const { refreshToken, email } = req.body;

    // check availablity of refresh token if exists will return a succes if not exists will throw an error
    await axios(userServiceUrl).get(`/refresh-tokens/${refreshToken}`);

    verify(refreshToken, jwtAppSecretRefresh, async (err, value) => {
      if (err)
        return res.status(403).json({
          status: "error",
          message: err.message,
        });

      const userId = value.id;

      const user = (await axios(userServiceUrl).get(`/${userId}`)).data.data
        .user;

      if (email != user.email)
        return res.status(400).json({
          status: "error",
          message: "Invalid email!",
        });

      const token = getJwToken(user);

      return res.status(201).json({
        status: "created",
        data: {
          token,
        },
      });
    });
  } catch (err) {
    console.log(err);
    if (err.code == "ECONNREFUSED")
      return res.status(500).json({
        status: "error",
        message: "User service is not available",
      });

    if (!err.response)
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });

    const { status, data } = err.response;

    return res.status(status).json(data);
  }
};
