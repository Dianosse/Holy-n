const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tag', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    libelle: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: "tag_libelle_key"
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
      {
        name: "tag_libelle_key",
        unique: true,
        fields: [
          { name: "libelle" },
        ]
      },
    ]
  });
};
