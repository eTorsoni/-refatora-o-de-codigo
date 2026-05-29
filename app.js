const express = require('express');
const cors = require('cors');
const categoriasRouter = require('./routes/categorias');
const produtosRouter = require('./routes/produtos');
const pedidosRouter = require('./routes/pedidos');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API backend funcionando' });
});

app.use('/categorias', categoriasRouter);
app.use(['/produtos', '/products'], produtosRouter);
app.use('/pedidos', pedidosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use(errorHandler);

module.exports = app;
