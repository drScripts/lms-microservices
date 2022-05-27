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
    const file = req.file;
    const data = new FormData();

    if (file) {
      data.append("media", fs.createReadStream(file.path));
    }

    data.append("description", req.body.description ?? "");

    const apiRes = await axios(mediaServiceUrl)
      .post("/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {
        console.log(err.response);
        return err.response;
      });

    if (apiRes.status == 500)
      return res.status(500).json({
        status: "error",
        message: "Media services is not available!",
      });

    return res.status(apiRes.status).json(apiRes.data);
  } catch (err) {
    console.log(err);
    if (err.code == "ECONNREFUSED")
      return res.status(500).json({
        status: "error",
        message: "Media services is not available!",
      });
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
