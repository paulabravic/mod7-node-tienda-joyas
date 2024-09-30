const { obtenerJoyas, obtenerJoyasFiltro } = require('./consultas');
const cors = require("cors");
const express = require("express");
const loggerMiddleware = require('./loggerMiddleware');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);


app.get("/", async (req,res) => {
  try {
    res.json("Bienvenido a la api");
  } catch (error) {
    res.status(500).json("Un error ha ocurrido: " + error);
  }
});

app.get('/joyas', async (req, res) => {
  try {
    console.log(`req.query: ${req.query}`)
    let joyas = await obtenerJoyas(req.query);
    res.json(joyas);
  } catch (error) {
    res.status(500).json("Un error ha ocurrido: " + error);
  }
});

app.get('/joyas/filtros', async (req, res) => {
  try {
    console.log(`req.query: ${req.query}`)
    let joyas = await obtenerJoyasFiltro(req.query);
    res.json(joyas);
  } catch (error) {
    res.status(500).json("Un error ha ocurrido: " + error);
  }
});

app.use('*', (req, res) => {
  res.status(404).json('Página no encontrada');
});

app.listen(port, () => console.log("servidor escuchado en puerto 3000")); 
