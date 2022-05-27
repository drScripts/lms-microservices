const { request, response } = require("express");
const { verify } = require("jsonwebtoken");
const { jwtAppSecret } = require("../config");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || auth.search("Bearer ") === -1)
    return res.status(401).json({
      status: "error",
      message: "Please login!",
    });

  try {
    const isValid = verify(auth.split("Bearer ")[1], jwtAppSecret);

    if (!isValid)
      return res.status(401).json({
        status: "error",
        message: "Please login!",
      });

    req.user = isValid;

    next();
  } catch (er) {
    return res.status(401).json({
      status: "error",
      message: "Please login!",
    });
  }
};
