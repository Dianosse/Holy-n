const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('parichoix', {
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
    }
  }, {
    sequelize,
    tableName: 'parichoix',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_parichoix",
        unique: true,
        fields: [
          { name: "idpari" },
          { name: "idchoix" },
        ]
      },
    ]
  });
};
