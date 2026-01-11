const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Para que el servidor entienda archivos JSON

// Configuración de tu PostgreSQL (Cámbialo por tus datos)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_password',
  port: 5432,
});

// PRUEBA: Ruta para ver si el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor de Proyectos funcionando 🚀');
});

// --- RUTA PARA OBTENER PROYECTOS (Punto 1) ---
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proyectos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

const PORT = 4000; // Usamos el 4000 porque React usa el 3000
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${4000}`);
});