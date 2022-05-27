const { request, response } = require("express");
const FormData = require("form-data");
const { mediaServiceUrl } = require("../../config");
const axios = require("../../services/apiAdapter");
const fs = require("fs");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const file = req.file;

    const formData = new FormData();

    if (file) {
      formData.append("media", fs.createReadStream(file.path));
    }

    if (req.body.description) {
      console.log("desc");
      formData.append("description", req.body.description);
    }

    const resApi = await axios(mediaServiceUrl)
      .patch(`/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => err.response);

    if (resApi.status == 500)
      return res.status(500).json({
        status: "error",
        message: "Media service is not available",
      });

    return res.status(resApi.status).json(resApi.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
