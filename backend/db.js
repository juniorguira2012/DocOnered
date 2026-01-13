require("dotenv").config(); // Esto carga las variables del archivo .env
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ""),
  port: parseInt(process.env.DB_PORT) || 5432, // Asegura que sea un número
});

// Prueba rápida de conexión
pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌ Error de conexión:", err.stack);
  }
  console.log("✅ Conexión a PostgreSQL establecida con éxito");
  release();
});

module.exports = pool;
