'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Proposal.hasMany(models.RiwayatProposal, {
         foreignKey: 'proposal_id',
         as: 'riwayat_proposal'
         });
    }
  }
  Proposal.init({
    username: DataTypes.STRING,
    nama: DataTypes.STRING,
    alamat_domisili: DataTypes.TEXT,
    nama_usaha: DataTypes.STRING,
    legalitas: DataTypes.TEXT,
    kontak: DataTypes.STRING,
    produk: DataTypes.STRING,
    latar_belakang: DataTypes.TEXT,
    isi_proposal: DataTypes.TEXT,
    jenis_bantuan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Proposal',
  });
  return Proposal;
};