'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Proposals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      alamat_domisili: {
        type: Sequelize.TEXT
      },
      nama_usaha: {
        type: Sequelize.STRING
      },
      legalitas: {
        type: Sequelize.TEXT
      },
      kontak: {
        type: Sequelize.STRING
      },
      produk: {
        type: Sequelize.STRING
      },
      latar_belakang: {
        type: Sequelize.TEXT
      },
      isi_proposal: {
        type: Sequelize.TEXT
      },
      jenis_bantuan: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Proposals');
  }
};