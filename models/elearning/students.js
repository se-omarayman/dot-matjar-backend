/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('students', {
    student_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'students',
    timestamps: false
  });
};