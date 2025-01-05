'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entity_Statuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entityId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Entities'
          },
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      message: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('rejected', 'accepted', 'pending')
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
    await queryInterface.dropTable('Entity_Statuses');
  }
};