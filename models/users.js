

'use strict';

module.exports = (sequelize, DataTypes) => {

  const users = sequelize.define('users', {

    UserId: {
     type: DataTypes.INTEGER,
     primaryKey: true,
     allowNull: false,
     autoincrement: true
    },

    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      unique: true
    },

    Username: {
      type: DataTypes.STRING,
      unique: true
    },

    Password: DataTypes.STRING, 

    Admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    Deleted: DataTypes.BOOLEAN

  }, {});


  users.associate = function(models) {
    // associations can be defined here
  };

  return users;
};

