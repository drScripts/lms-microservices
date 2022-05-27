require("dotenv").config();

module.exports = {
  dbUser: process.env.DATABASE_USERNAME,
  dbPass: process.env.DATABASE_PASSWORD,
  dbHost: process.env.DATABASE_HOST,
  dbName: process.env.DATABASE_NAME,
  dbDialect: process.env.DATABASE_DIALECT,
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? 2),
};
