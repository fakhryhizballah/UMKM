'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class file extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  file.init({
    username: DataTypes.STRING,
    jenis_files: DataTypes.STRING,
    catatan: DataTypes.STRING,
    nomor: DataTypes.STRING,
    url_data: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('1', '0'),
      defaultValue: '0'
    },
  }, {
    sequelize,
    modelName: 'file',
  });
  return file;
};