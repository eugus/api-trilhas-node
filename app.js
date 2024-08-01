const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Destino, Atrativo } = require('./models/index');



const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const verificarDestino = async (req, res, next) => {
  const destinoId = req.body.destinoId || req.params.destinoId;
  const destino = await Destino.findByPk(destinoId);
  if (!destino) {
    return res.status(404).json({ error: 'Destino não encontrado' });
  }
  next();
};// Middleware para analisar JSON

// Destino.hasMany(Atrativo, { foreignKey: 'destinoId', as: 'atrativos' });
// Atrativo.belongsTo(Destino, { foreignKey: 'destinoId', as: 'destino' });

//app.use('/destinos', destinosRoutes);

app.post('/destinos/criar', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const destino = await Destino.create({ nome, descricao });
    res.status(201).json(destino);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/destinos', async (req, res) => {
  try {
    const destinos = await Destino.findAll();
    res.status(200).json(destinos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/destinos/:id', async (req, res) => {
  try {
    const destino = await Destino.findByPk(req.params.id);
    if (destino) {
      res.status(200).json(destino);
    } else {
      res.status(404).json({ message: 'Destino não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Atualizar um destino
app.put('/destinos/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const [updated] = await Destino.update({ nome, descricao }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const destino = await Destino.findByPk(req.params.id);
      res.status(200).json(destino);
    } else {
      res.status(404).json({ message: 'Destino não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Deletar um destino
app.delete('/destinos/:id', async (req, res) => {
  try {
    const deleted = await Destino.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: 'Destino não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/atrativos/criar', verificarDestino, async (req, res) => {
  try {
    const { nome, descricao, destinoId } = req.body;
    const atrativo = await Atrativo.create({ nome, descricao, destinoId });
    res.status(201).json(atrativo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/atrativos', async (req, res) => {
  try {
    const atrativos = await Atrativo.findAll({
      include: [{ model: Destino, as: 'destino', attributes: ['nome'] }] // Inclui informações do Destino usando o alias
    });
    res.status(200).json(atrativos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/atrativos/:id', async (req, res) => {
  try {
    const atrativo = await Atrativo.findByPk(req.params.id, {
      include: [{ model: Destino, as: 'destino', attributes: ['nome'] }] // Inclui informações do Destino usando o alias
    });
    if (atrativo) {
      res.status(200).json(atrativo);
    } else {
      res.status(404).json({ error: 'Atrativo não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/atrativos/:id', verificarDestino, async (req, res) => {
  try {
    const { nome, descricao, destinoId } = req.body;
    const [updated] = await Atrativo.update({ nome, descricao, destinoId }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const atrativo = await Atrativo.findByPk(req.params.id, {
        include: [{ model: Destino, as: 'destino', attributes: ['nome'] }] // Inclui informações do Destino usando o alias
      });
      res.status(200).json(atrativo);
    } else {
      res.status(404).json({ error: 'Atrativo não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Excluir um atrativo pelo ID
app.delete('/atrativos/:id', async (req, res) => {
  try {
    const deleted = await Atrativo.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Atrativo não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sincronizar com o banco de dados
sequelize.sync({ force: true }).then(() => {
  console.log('Banco de dados sincronizado');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


