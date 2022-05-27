const { request, response } = require("express");
const { User } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { user_ids } = req.query;

    const users = [];

    const rawUsers = await User.findAll({
      where: user_ids ? { id: user_ids } : {},
      include: "profile",
      attributes: {
        exclude: ["password"],
      },
    });

    rawUsers.forEach((user) => {
      users.push({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.profile.phoneNumber,
        profession: user.profile.profession,
        avatar: user.profile.avatar,
      });
    });

    res.send({
      status: "success",
      data: { users },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
