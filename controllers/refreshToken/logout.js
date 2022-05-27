const { request, response } = require("express");
const { User, RefreshToken } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "Can't find user by that id",
      });

    await RefreshToken.destroy({ where: { userId } });

    return res.status(201).json({
      status: "succes",
      message: "Refresh token successfully deleted!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
