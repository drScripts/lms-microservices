const {
  cloudinaryApiKey,
  cloudinaryName,
  cloudinaryApiSecret,
} = require("../config");

const cloudinary = require("cloudinary").v2;
const { UploadApiResponse } = require("cloudinary");

cloudinary.config({
  api_key: cloudinaryApiKey,
  cloud_name: cloudinaryName,
  api_secret: cloudinaryApiSecret,
});

/**
 *
 * @param {String} filePath
 * @returns {Promise<UploadApiResponse>}
 */
const postImage = async (filePath) => {
  const res = await cloudinary.uploader.upload(filePath, {
    folder: "lmsMicroservicesMedia",
  });

  return res;
};

const deleteImage = async (publicId) => {
  const res = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  return res;
};

module.exports = { postImage, deleteImage };
