// models/atrativo.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Atrativo', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING
    },
    destinoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Destinos',
        key: 'id'
      },
      allowNull: false
    }
  });

  Atrativo.associate = (models) => {
    // Define the association
    Atrativo.belongsTo(models.Destino, {
      foreignKey: 'destinoId',
      as: 'destino' // Alias for the relationship
    });
  };

  return Atrativo;

  
};
