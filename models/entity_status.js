'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entity_Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Entity_Status.init({
    entityId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    status: DataTypes.ENUM('rejected', 'accepted', 'pending')
  }, {
    sequelize,
    modelName: 'Entity_Status',
  });
  return Entity_Status;
};