'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thumbnail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Thumbnail.init({
    id_foto: DataTypes.STRING,
    url: DataTypes.STRING,
    alt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Thumbnail',
  });
  return Thumbnail;
};