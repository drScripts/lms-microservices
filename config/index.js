require("dotenv").config();

module.exports = {
  dbName: process.env.DATABASE_NAME,
  dbPass: process.env.DATABASE_PASSWORD,
  dbUser: process.env.DATABASE_USER,
  dbHost: process.env.DATABASE_HOST,
  dbDialect: process.env.DATABASE_DIALECT,
};
