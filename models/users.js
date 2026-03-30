const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    ban: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    passwordhash: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mail: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    solde: {
      type: DataTypes.DECIMAL,
      allowNull: true
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
    ]
  });
};
