'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    username: DataTypes.STRING,
    url_pp: DataTypes.STRING,
    alamat: DataTypes.STRING,
    provinsi: DataTypes.STRING,
    kota: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    kelurahan: DataTypes.STRING,
    betuk_usaha: DataTypes.STRING,
    ukuran_pasar: DataTypes.STRING,
    modal: DataTypes.STRING,
    tahun_berdiri: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};