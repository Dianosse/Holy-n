const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pari', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    iduser: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    approuve: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    intitule: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    datecreation: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    datecloture: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    datesuppression: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
