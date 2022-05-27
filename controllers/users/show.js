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

    return res.send({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.profile.phoneNumber,
          profession: user.profile.profession,
          avatar: user.profile.avatar,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
