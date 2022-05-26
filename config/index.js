require("dotenv").config();

module.exports = {
  dbUser: process.env.DATABASE_USERNAME,
  dbPass: process.env.DATABASE_PASSWORD,
  dbHost: process.env.DATABASE_HOST,
  dbName: process.env.DATABASE_NAME,
  dbDialect: process.env.DATABASE_DIALECT,
};
