const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mise', {
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
    idpari: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'pari',
        key: 'id'
      }
    },
    idchoix: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'choix',
        key: 'id'
      }
    },
    montant: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    datedepari: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'mise',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_mise",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
