'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING
      },
      nowa: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      badanusaha: {
        type: Sequelize.STRING
      },
      npwp: {
        type: Sequelize.STRING
      },
      nib: {
        type: Sequelize.STRING
      },
      omzet: {
        type: Sequelize.STRING
      },
      kategoriusaha: {
        type: Sequelize.STRING
      },
      levelusaha: {
        type: Sequelize.STRING
      },
      logousaha: {
        type: Sequelize.STRING
      },
      deskripsiusaha: {
        type: Sequelize.TEXT
      },
      deskripsiproduk: {
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
    await queryInterface.dropTable('Entities');
  }
};