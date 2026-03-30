const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tag', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    libelle: {
      type: DataTypes.STRING(16),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tag',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tag",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
