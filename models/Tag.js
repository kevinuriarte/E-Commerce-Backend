const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

//Creates Tag model
class Tag extends Model {}

//Creates fields/columns for Tag model
Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    tag_name: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

module.exports = Tag;