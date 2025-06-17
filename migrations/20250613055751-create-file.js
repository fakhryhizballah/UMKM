'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      jenis_files: {
        type: Sequelize.STRING
      },
      catatan: {
        type: Sequelize.STRING
      },
      nomor: {
        type: Sequelize.STRING
      },
      url_data: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('1', '0'),
        defaultValue: '0',
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
    await queryInterface.dropTable('files');
  }
};