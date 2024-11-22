'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Villages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idVillage: {
        type: Sequelize.BIGINT,
        unique: true
      },
      name: {
        type: Sequelize.STRING
      },
      districtId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Districts'
          },
          key: 'idDistrict',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
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
    await queryInterface.dropTable('Villages');
  }
};