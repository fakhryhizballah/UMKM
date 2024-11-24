'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Location.belongsTo(models.Province, {
        foreignKey: 'province',
        targetKey: 'idProvince',
        as: 'prov'
      });
      models.Location.belongsTo(models.Regency, {
        foreignKey: 'regency',
        targetKey: 'idRegency',
        as: 'regen'
      });
      models.Location.belongsTo(models.District, {
        foreignKey: 'district',
        targetKey: 'idDistrict',
        as: 'dist'
      });
      models.Location.belongsTo(models.Village, {
        foreignKey: 'village',
        targetKey: 'idVillage',
        as: 'vill'
      });
    }
  }
  Location.init({
    entityId: DataTypes.INTEGER,
    lat: DataTypes.INTEGER,
    lng: DataTypes.INTEGER,
    address: DataTypes.STRING,
    province: DataTypes.INTEGER,
    regency: DataTypes.INTEGER,
    district: DataTypes.INTEGER,
    village: DataTypes.INTEGER,
    status: DataTypes.ENUM('rejected', 'accepted', 'pending')
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};