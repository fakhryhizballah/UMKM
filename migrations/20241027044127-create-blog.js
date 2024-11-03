'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: {
            tableName: 'Categories'
          },
          key: 'slug',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      author: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'username',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      status: {
        type: Sequelize.ENUM('published', 'draft')
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
    await queryInterface.dropTable('Blogs');
  }
};