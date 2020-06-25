/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    user_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'user'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    national_number: {
      type: DataTypes.INTEGER(20),
      allowNull: true
    },
    full_arabic_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mobile_number: {
      type: DataTypes.INTEGER(15),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    full_english_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    qualification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    job: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    governorate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    village: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    center: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.INTEGER(15),
      allowNull: true
    },
    fax: {
      type: DataTypes.INTEGER(15),
      allowNull: true
    },
    facebook_account: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    linkedin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
};