import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

// AQUÍ EL CAMBIO CLAVE:
// El ":any*" le da un nombre al parámetro y el asterisco permite cualquier ruta
// Usamos una expresión regular pura de JavaScript. 
// Esto captura TODO sin depender de la sintaxis de la librería.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 OneRedRD en producción: http://localhost:${PORT}`);
});