const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paritag', {
    idpari: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'pari',
        key: 'id'
      }
    },
    idtag: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tag',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'paritag',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_paritag",
        unique: true,
        fields: [
          { name: "idpari" },
          { name: "idtag" },
        ]
      },
    ]
  });
};
