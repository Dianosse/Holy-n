const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mise', {
    iduser: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    idpari: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'pari',
        key: 'id'
      }
    },
    idchoix: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'choix',
        key: 'id'
      }
    },
    montant: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    datedepari: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
          { name: "iduser" },
          { name: "idpari" },
          { name: "idchoix" },
        ]
      },
    ]
  });
};
