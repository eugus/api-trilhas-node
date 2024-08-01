// models/destino.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Destino', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING
    }
  });

  Destino.associate = (models) => {
    // Define the association
    Destino.hasMany(models.Atrativo, {
      foreignKey: 'destinoId',
      as: 'atrativos' // Alias for the relationship
    });
  };

  return Destino;
};
