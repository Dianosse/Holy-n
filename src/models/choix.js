const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('choix', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    libelle: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'choix',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_choix",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
