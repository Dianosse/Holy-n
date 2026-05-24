const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pari', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    iduser: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    approuve: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    intitule: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    datecreation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    datecloture: {
      type: DataTypes.DATE,
      allowNull: true
    },
    datearchivage: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idchoixgagnant: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'choix',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pari',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_pari",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
