'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init({
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    content: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    category: DataTypes.STRING,
    author: DataTypes.STRING,
    status: DataTypes.ENUM('published', 'draft')
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};