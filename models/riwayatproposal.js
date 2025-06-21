'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiwayatProposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RiwayatProposal.init({
    proposal_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    catatan: DataTypes.TEXT,
    tanggal: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RiwayatProposal',
  });
  return RiwayatProposal;
};