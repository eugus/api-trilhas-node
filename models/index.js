// models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Cria uma instância do Sequelize conectando ao SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, 'database.sqlite') // Caminho para o arquivo de banco de dados
});

// Importa e define os modelos
const Destino = require('./destino')(sequelize);
const Atrativo = require('./atrativo')(sequelize);

// Define relacionamentos
Destino.hasMany(Atrativo, { foreignKey: 'destinoId', as: 'atrativos' });
Atrativo.belongsTo(Destino, { foreignKey: 'destinoId', as: 'destino' });

// Sincroniza os modelos com o banco de dados
sequelize.sync({ force: true }) // `force: true` recria o banco de dados, excluindo tabelas existentes
  .then(() => console.log('Banco de dados sincronizado com sucesso.'))
  .catch(err => console.error('Erro ao sincronizar o banco de dados:', err));

module.exports = { sequelize, Destino, Atrativo };

