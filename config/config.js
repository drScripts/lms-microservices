const { dbDialect, dbUser, dbPass, dbName, dbHost } = require(".");

module.exports = {
  development: {
    username: dbUser,
    password: dbPass,
    database: dbName,
    host: dbHost,
    dialect: dbDialect,
  },
  test: {
    username: dbUser,
    password: dbPass,
    database: dbName,
    host: dbHost,
    dialect: dbDialect,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: dbDialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
