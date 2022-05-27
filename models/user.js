"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.UserProfile, {
        as: "profile",
        foreignKey: "userId",
      });

      User.hasOne(models.RefreshToken, {
        as: "refreshToken",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      role: DataTypes.ENUM("admin", "user"),
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      timestamps: true,
    }
  );
  return User;
};
