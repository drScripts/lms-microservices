"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Media.init(
    {
      path: DataTypes.STRING,
      description: DataTypes.TEXT,
      publicId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Media",
      timestamps: true,
      paranoid: true,
    }
  );
  return Media;
};
