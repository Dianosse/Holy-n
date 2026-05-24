const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    nom: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    prenom: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    pseudo: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ban: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    passwordhash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "users_mail_key"
    },
    solde: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_user",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_mail_key",
        unique: true,
        fields: [
          { name: "mail" },
        ]
      },
    ]
  });
};
