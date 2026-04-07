const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('amis', {
    iduser: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    idamis: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'amis',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_amis",
        unique: true,
        fields: [
          { name: "iduser" },
          { name: "idamis" },
        ]
      },
    ]
  });
};
