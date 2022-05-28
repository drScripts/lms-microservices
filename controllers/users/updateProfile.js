const { request, response } = require("express");
const { userServiceUrl, mediaServiceUrl } = require("../../config");
const axios = require("../../services/apiAdapter");
const fs = require("fs");
const FormData = require("form-data");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const body = req.body;
    let avatar = null;

    if (req.file) {
      const formData = new FormData();
      formData.append("media", fs.createReadStream(req.file.path));

      const media = await axios(mediaServiceUrl).post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      avatar = media.data.data.media;
      body.avatar = avatar.id;
    }

    const { id: userId } = req.user;

    const user = await axios(userServiceUrl).patch(
      `/${userId}`,
      JSON.stringify(body),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (avatar) {
      user.data.data.user.avatar = avatar;
    }

    return res.send({
      status: "success",
      data: user.data.data.user,
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
