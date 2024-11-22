'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Locations', {
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
      lat: {
        type: Sequelize.STRING,
      },
      lng: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Provinces'
          },
          key: 'idProvince',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      regency: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Regencies'
          },
          key: 'idRegency',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      district: {
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
      village: {
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('Locations');
  }
};