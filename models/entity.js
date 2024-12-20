'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Entity.hasOne(models.Location, { foreignKey: 'entityId' });
      models.Entity.hasMany(models.Product, { foreignKey: 'entityId' });
      models.Entity.hasOne(models.User, {
        foreignKey: 'username',
        sourceKey: 'username',
        as: 'user'
      });
    }
  }
  Entity.init({
    username: DataTypes.STRING,
    badanusaha: DataTypes.STRING,
    npwp: DataTypes.STRING,
    nib: DataTypes.STRING,
    omzet: DataTypes.STRING,
    kategoriusaha: DataTypes.STRING,
    levelusaha: DataTypes.STRING,
    logousaha: DataTypes.STRING,
    deskripsiusaha: DataTypes.TEXT,
    deskripsiproduk: DataTypes.TEXT,
    status: DataTypes.ENUM('rejected', 'accepted', 'pending')
  }, {
    sequelize,
    modelName: 'Entity',
  });
  return Entity;
};